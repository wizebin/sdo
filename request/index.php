<?php
  header('Access-Control-Allow-Origin: *');

  include_once ("creds.php");
  include_once ("sql.php");

  function getPostOrJsonBody() {
    if (isset($_POST) && count($_POST) > 0) return $_POST;
    else if (isset($_GET) && count($_GET) > 0) return $_GET;
    $input=file_get_contents('php://input');
    return json_decode($input,true);
  }

  function detectMimeType($content) {
    if (strlen($content) > 0) {
      if ($content[0] == '{' && $content[strlen($content)-1] == '}') return 'json';
      else if ($content[0] == '<') return 'xml';
    }
    return '';
  }

  function fixArray($in) {
    if (is_array($in)) foreach ($in as $k => $v) {$in[$k] = fixArray($v);}
    else if (is_string ($in)) return utf8_encode($in);
    return $in;
  }

  class request{
    // public $insertid = '';
    public $success = false;
    // public $results = array();
    public $err = array();

    public $seclevel = 0;

    public $verb = '';
    public $data = array();
    public $type = '';
    public $id = '';
    public $idlabel = '';
    public $limit = 100;
    public $sortby = '';
    public $filters = '';
    public $page = 0;
    public $database = '';
    public $query = '';
    public $username = '';
    public $password = '';
    public $db = null;
    public $auth = null;
    public $warn = array();
    public $securitylevel = 0;

    function __construct($encoded) {
      $this->requestEncoded($encoded);
    }

    public function openDB() {
      if ($this->db === null)
        $this->db = openConf();
      return $this->db;
    }

    public function addError($err) {
      array_push($this->err, $err);
    }

    public function addWarning($warn) {
      array_push($this->warn, $warn);
    }

    public function authenticate() {
      global $credtable, $creduser, $credpass, $credorg, $credid, $credseclevel;
      if (isset($credtable) && isset($creduser) && isset($credpass) && isset($credorg) && isset($credid)){
        if ($this->openDB() !== false) {
          $qrey = 'SELECT * FROM ' . $credtable . ' WHERE ' . $creduser . ' = ' . escapeConf($this->db, $this->username) . ' AND ' . $credpass . ' = ' . escapeConf($this->db, $this->password) . ' LIMIT 1';
          $results = executeConf($this->db, $qrey);
          if (is_array($results) && count($results) === 1) {
            $ret = array();
            $ret['id'] = $results[0][$credid];
            $ret['user'] = $results[0][$creduser];
            $ret['org'] = $results[0][$credorg];
            $ret['seclevel'] = $results[0][$credseclevel];
            $this->auth=$ret;
            $this->securityLevel = $results[0][$credseclevel];
            return true;
          } else {
            $this->success=false;
            $this->addError('Could not authenticate, username or password incorrect');
            return false;
          }
        }
        $this->addError('could not open DB');
        return false;
      } else {
        $this->addWarning('no credential information set');
        return true;
      }
    }

    public function request() {
      if ($this->openDB() === false) {
        $this->addError('could not open DB');
        $this->success=false;
      } else if ($this->verb == 'get') {
        $table = escapeIdentifierConf($this->db, $this->type);
        $idlabel = escapeIdentifierConf($this->db, $this->idlabel);
        $id = escapeConf($this->db, $this->id);

        $qrey = "SELECT * FROM $table WHERE $idlabel = $id";
        $results = executeConf($this->db, $qrey);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'list') {
        $filters = isset($this->filters)?$this->filters:array(); // ['id'=>123]
        $sortby = isset($this->sortby)?$this->sortby:array(); //['id'=>'DESC']
        $links = isset($this->links)?$this->links:array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($this->db, $this->type);

        $results = listWithParamsConf($this->db, $table, $page, $pagesize, $filters, $sortby);

        if (count($links) > 0 && is_array($results) && count($results) > 0) {
          foreach($links as $link) {
            $childTable = $link['table'];
            $tableColumn = $link['tableColumn'];
            $parentColumn = $link['parentColumn'];

            $idtoindex = array();
            $resultIds = array();

            foreach($results as $key => $row) {
              array_push($resultIds, escapeConf($this->db, $row[$parentColumn]));
              $idtoindex[$row[$parentColumn]]=$key;
            }
            $stringIds = implode(', ',$resultIds);

            $iqrey = "SELECT * FROM $childTable WHERE $tableColumn in ($stringIds)";

            $ires = executeConf($this->db, $iqrey);

            if (count($ires) > 0) {
              foreach($ires as $irow) {
                if (!isset($results[$idtoindex[$irow[$tableColumn]]][$childTable])) {
                  $results[$idtoindex[$irow[$tableColumn]]][$childTable] = array();
                }
                $results[$idtoindex[$irow[$tableColumn]]][$childTable]=$irow;
              }
            }
          }
        }

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'count') {
        $filters = isset($this->filters)?json_decode($this->filters,true):array(); // ['id'=>123]
        $sortby = isset($this->sortby)?json_decode($this->sortby,true):array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($this->db, $this->type);

        $results = listWithParamsConf($this->db, $table, null, null, $filters, $sortby, true);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'update') {
        $table = escapeIdentifierConf($this->db, $this->type);
        $idlabel = escapeIdentifierConf($this->db, $this->idlabel);
        $id = escapeConf($this->db, $this->id);

        $data = json_decode($this->data,true);

        $sets = "";

        if (count($data)>0){
          $sets = " SET ";
          $setlist = array();
          foreach($sortby as $key => $val){
            array_push($setlist,escapeIdentifierConf($this->db,$key) . " = " . escapeConf($this->db,$val));
          }
          $sets .= implode(", ",$sortedlist);
        }

        $qrey = "UPDATE $table $sets WHERE $idlabel = $id";
        $results = executeConf($this->db, $qrey);

        $this->results=$results;
        $this->affected=$lastaffected;
        $this->success=true;
      } else if ($this->verb == 'create') {
        $table = escapeIdentifierConf($this->db, $this->type);

        $data = json_decode($this->data,true);

        $keys = "";
        $vals = "";

        if (is_array($data) && count($data)>0){
          $keylist = array();
          $vallist = array();

          foreach($data as $key => $val){
            array_push($keylist,escapeIdentifierConf($this->db,$key));
            array_push($vallist,escapeConf($this->db,$val));
          }

          $keys = implode(",",$keylist);
          $vals = implode(", ",$vallist);
        }

        $qrey = "INSERT INTO $table ($keys) VALUES($vals);";
        $results = executeConf($this->db, $qrey);

        if ($results){
          $this->results=$results;
          $this->affected=$lastaffected;
          $this->insertid=$lastid;
          $this->success=true;
        }
        else{
          $this->addError('INSERT FAILED ' . json_encode($results));
          $this->success=false;
        }
      } else if ($this->verb == 'delete') {
        if ($this->seclevel>=100){
          $table = escapeIdentifierConf($this->db, $this->type);
          $idlabel = escapeIdentifierConf($this->db, $this->idlabel);
          $id = escapeConf($this->db, $this->id);

          $qrey = "DELETE * FROM $table WHERE $idlabel = $id LIMIT 1";
          $results = executeConf($this->db, $qrey);

          $this->results=$results;
          $this->affected=$lastaffected;
          $this->success=true;
        }
        else{
          $this->success=false;
          $this->addError('Security Level Too Low');
        }
      } else if ($this->verb == 'describe') {
        $table = escapeIdentifierConf($this->db, $this->type);
        $results = describeTableConf($this->db, $table);
        $this->results=$results;
        $this->affected=$lastaffected;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'tables') {
        $database = isset($this->database)?escapeIdentifierConf($this->db, $this->database):null;
        $results = listTablesConf($this->db, $database);
        $this->results=$results;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'indexes') {
        $table = escapeIdentifierConf($this->db, $this->type);
        $results = listIndexedConf($this->db, $table);
        $this->results=$results;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'arbitrary') {
        if ($username==$masterUsername){
          $qrey = $this->query;
          $results = executeConf($this->db, $qrey);
          $this->results=$results;
          $this->affected=$lastaffected;
        }
      } else if ($this->verb == 'structure') {
        $tablelist = json_decode($this->data, true);
        $this->results = array();
        foreach($tablelist as $fieldlist){
          $table = $fieldlist["name"];
          $describeray = array();
          $primaryRay = array();
          array_push($fieldlist["fields"], array('name'=>'organizationID','sqltype'=>'INTEGER PRIMARY KEY'));
          foreach($fieldlist["fields"] as $field){
            $this->results[$table]["result"]=$field;
            $name = $field['name'];
            $type = $field['sqltype'];
            if (strripos($type, "PRIMARY KEY")!==false){
              $type = str_ireplace("PRIMARY KEY", "", $type);
              array_push($primaryRay,escapeIdentifierConf($this->db,$name));
            }
            array_push($describeray, escapeIdentifierConf($this->db,$name) . " " . escapeIdentifierConf($this->db,$type));
          }
          if (count($primaryRay) == 1 && isset($fieldlist["keyname"])){
            array_push($primaryRay, $fieldlist["keyname"]);
            array_push($describeray, $fieldlist["keyname"] . " INTEGER");
            $this->results[$table]['pkey']=$fieldlist["keyname"];
            $this->results[$table]["primaryRay"]=$primaryRay;
          }
          array_push($describeray, "PRIMARY KEY (".implode(",",$primaryRay).")");
          $fields = implode(", ", $describeray);

          $qrey = "CREATE TABLE IF NOT EXISTS $table ($fields);";
          $res = executeConf($this->db,$qrey);

          foreach($primaryRay as $col){
            $indexqrey = "SELECT COUNT(1) IndexIsThere FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema=DATABASE() AND table_name='$table' AND index_name='$col';";
            $ires = executeConf($this->db, $indexqrey);
            if ($ires==false || count($ires)==0){
              $adddexqrey = "CREATE INDEX $col ON $table($col);";
              executeConf($this->db, $adddexqrey);
            }
          }
          $this->success=$res !== false && $res !== null;
        }
      } else if ($this->verb == 'getpage') {
        if (preg_match('/^([\w\d_]+\.?([\w\d_]+)?)$/', $this->page)){
          $page = 'pages/'.$this->page;
          if (file_exists($page)){
            ob_start();
            include($page);
            $output = ob_get_clean();
            $this->results=$output;
            $this->success = true;
          } else {
            $this->addError('unknown page');
          }
        } else {
          $this->addError('does not match acceptable page pattern');
        }
      } else {
        $this->addError('unknown verb');
      }

      return $this;
    }

    public function requestEncoded($encoded) {
      if (isset($encoded['verb']))
        $this->verb = $encoded['verb'];
      if (isset($encoded['data']))
        $this->data = $encoded['data'];
      if (isset($encoded['type']))
        $this->type = $encoded['type'];
      if (isset($encoded['id']))
        $this->id = $encoded['id'];
      if (isset($encoded['idlabel']))
        $this->idlabel = $encoded['idlabel'];
      if (isset($encoded['limit']))
        $this->limit = $encoded['limit'];
      if (isset($encoded['links']))
        $this->links = $encoded['links'];
      if (isset($encoded['sortby']))
        $this->sortby = $encoded['sortby'];
      if (isset($encoded['filters']))
        $this->filters = $encoded['filters'];
      if (isset($encoded['page']))
        $this->page = $encoded['page'];
      if (isset($encoded['database']))
        $this->database = $encoded['database'];
      if (isset($encoded['query']))
        $this->query = $encoded['query'];
      if (isset($encoded['username']))
        $this->username = $encoded['username'];
      if (isset($encoded['password']))
        $this->password = $encoded['password'];

      if ($this->authenticate()) {
        return $this->request();
      }

      return $this;
    }

    public function toReturnArray() {
      global $dberrors;
      $ret = array();
      if (isset($this->auth))
        $ret['AUTH']=$this->auth;
      if (isset($this->results))
        $ret['RESULTS']=$this->results;
      if (isset($this->success))
        $ret['SUCCESS']=$this->success;
      if (isset($this->err) && count($this->err) > 0)
        $ret['ERROR']=$this->err;
      if (isset($this->insertid))
        $ret['INSERTID']=$this->insertid;
      if (isset($this->affected))
        $ret['AFFECTED']=$this->affected;
      if (isset($dberrors) && count($dberrors) > 0)
        $ret['SQLERRORS']=$dberrors;
      if (isset($this->warn) && count($this->warn) > 0)
        $ret['WARNINGS']=$this->warn;
      return $ret;
    }
  }
  $tmp = new request(getPostOrJsonBody());
  $tmpo = $tmp->toReturnArray();
  echo(json_encode(fixArray($tmpo)));
?>