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
    public $filters = array();
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

    public function insertRow($table, $data) {
      $keys = "";
      $vals = "";

      if (is_array($data) && count($data)>0){
        $keylist = array();
        $vallist = array();

        foreach($data as $key => $val){
          array_push($keylist,escapeIdentifierConf($this->db,$key));
          $value = escapeConf($this->db,$val);
          if ($value == '') $value = "''";
          array_push($vallist,$value);
        }

        $keys = implode(",",$keylist);
        $vals = implode(",",$vallist);
      }

      $qrey = "INSERT INTO $table ($keys) VALUES($vals);";
      $results = executeConf($this->db, $qrey);
    }

    public function updateRow($table, $idlabel, $id, $data) {
      $sets = "";

      if (count($data)>0){
        $sets = " SET ";
        $setlist = array();
        foreach($data as $key => $val){
          $value = escapeConf($this->db,$val);
          if ($value == '') $value = "''";
          array_push($setlist, escapeIdentifierConf($this->db,$key) . " = " . $value);
        }
        $sets .= implode(", ",$setlist);
      }

      $qrey = "UPDATE $table $sets WHERE $idlabel = $id";
      return executeConf($this->db, $qrey);
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

    public function applyLinksToResults() {
      $links = isset($this->links)?$this->links:array(); //['id'=>'DESC']

      if (count($links) > 0 && is_array($this->results) && count($this->results) > 0) {
        foreach($links as $link) {
          $childTable = $link['table'];
          $tableColumn = $link['tableColumn'];
          $parentColumn = $link['parentColumn'];

          $idtoindex = array();
          $resultIds = array();

          foreach($this->results as $key => $row) {
            array_push($resultIds, escapeConf($this->db, $row[$parentColumn]));
            $idtoindex[$row[$parentColumn]]=$key;
          }
          $stringIds = implode(', ',$resultIds);

          $iqrey = "SELECT * FROM $childTable WHERE $tableColumn in ($stringIds)";
          if (isset($this->auth) && isset($this->auth['org'])) $iqrey .= ' AND organizationID = ' . escapeConf($this->db, $this->auth['org']);

          $ires = executeConf($this->db, $iqrey);

          if (count($ires) > 0) {
            foreach($ires as $irow) {
              if (!isset($this->results[$idtoindex[$irow[$tableColumn]]][$childTable])) {
                $this->results[$idtoindex[$irow[$tableColumn]]][$childTable] = array();
              }
              array_push($this->results[$idtoindex[$irow[$tableColumn]]][$childTable], $irow);
            }
          }
        }
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
        if (isset($this->auth) && isset($this->auth['org'])) $qrey .= ' AND organizationID = ' . escapeConf($this->db, $this->auth['org']);

        $this->results = executeConf($this->db, $qrey);
        $this->applyLinksToResults();

        $this->success=is_array($this->results);
      } else if ($this->verb == 'list') {
        $filters = isset($this->filters)&&is_array($this->filters)?$this->filters:array(); // ['id'=>123]
        $sortby = isset($this->sortby)?$this->sortby:array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($this->db, $this->type);

        if (isset($this->auth) && isset($this->auth['org'])) array_push($filters, array('sub' => 'organizationID', 'verb' => 'eq', 'obj' => $this->auth['org']));

        $this->results = listWithParamsConf($this->db, $table, $page, $pagesize, $filters, $sortby);
        $this->applyLinksToResults();

        $this->success=is_array($this->results);
      } else if ($this->verb == 'count') {
        $filters = isset($this->filters)&&is_array($this->filters)?$this->filters:array(); // ['id'=>123]
        $sortby = isset($this->sortby)?json_decode($this->sortby,true):array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($this->db, $this->type);
        if (isset($this->auth) && isset($this->auth['org'])) array_push($filters, array('sub' => 'organizationID', 'verb' => 'eq', 'obj' => $this->auth['org']));

        $results = listWithParamsConf($this->db, $table, null, null, $filters, $sortby, true);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'update') {
        global $lastaffected;
        $table = escapeIdentifierConf($this->db, $this->type);
        $idlabel = escapeIdentifierConf($this->db, $this->idlabel);
        $id = escapeConf($this->db, $this->id);

        $data = json_decode($this->data,true);
        if (isset($this->auth) && isset($this->auth['org'])) $data['organizationID'] = $this->auth['org'];
        $this->results=$this->updateRow($table, $idlabel, $id, $data);
        $this->affected=$lastaffected;
        $this->success=true;
      } else if ($this->verb == 'create') {
        global $lastaffected, $lastid;
        $table = escapeIdentifierConf($this->db, $this->type);

        $data = json_decode($this->data,true);
        if (isset($this->auth) && isset($this->auth['org'])) $data['organizationID']=$this->auth['org'];

        $results = $this->insertRow($table, $data);

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
        global $lastaffected;
        if ($this->seclevel>=100){
          $table = escapeIdentifierConf($this->db, $this->type);
          $idlabel = escapeIdentifierConf($this->db, $this->idlabel);
          $id = escapeConf($this->db, $this->id);

          $qrey = "DELETE * FROM $table WHERE $idlabel = $id";
          if (isset($this->auth) && isset($this->auth['org'])) $qrey .= ' AND organizationID = ' . escapeConf($this->db, $this->auth['org']);
          $qrey .= ' LIMIT 1';
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
        global $lastaffected;
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
        global $lastaffected;
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
          array_push($fieldlist["fields"], array('name'=>'updated_at','sqltype'=>'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
          array_push($fieldlist["fields"], array('name'=>'updated_by','sqltype'=>'VARCHAR(128)'));
          array_push($fieldlist["fields"], array('name'=>'updated_source','sqltype'=>'VARCHAR(128)'));
          foreach($fieldlist["fields"] as $field){
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
          $this->results[$table]["result"]=$res;
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
      } else if ($this->verb == 'changes'){
        $data = json_decode($this->data, true);
        $idlabel = $this->idlabel;
        $table = escapeIdentifierConf($this->db, $this->type);
        $this->results = array();
        $adds = isset($data["add"]) ? $data["add"] : array();
        foreach($adds as $toadd) {
          if (isset($this->auth) && isset($this->auth['org'])) $toadd['organizationID']=$this->auth['org'];
          $retz = $this->insertRow($table, $toadd);
          if ($retz !== null) array_push($this->results, $retz);
        }
        $updates = isset($data["update"]) ? $data["update"] : array();
        foreach($updates as $toupdate) {
          if (isset($this->auth) && isset($this->auth['org'])) $toupdate['organizationID']=$this->auth['org'];
          $retz = $this->updateRow($table, $idlabel, $toupdate[$idlabel], $toupdate);
          if ($retz !== null) array_push($this->results, $retz);
        }
        // $deletes = $data["delete"];
        // foreach($deletes as $todelete) {
        //   if (isset($this->auth) && isset($this->auth['org'])) $todelete['organizationID']=$this->auth['org'];
        //   array_push($this->results,$this->deleteRow($table, $todelete));
        // }

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
      } else if ($this->verb == 'auth') {
        $this->success = $this->auth !== null;
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