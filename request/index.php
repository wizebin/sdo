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
    // public $err = null;

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

    function __construct($encoded) {
      $this->requestEncoded($encoded);
    }

    public function authenticate() {

    }

    public function request() {
      $db = openConf();
      if ($db==null) {
        $this->err = 'could not open db';
      } else if ($this->verb == 'get') {
        $table = escapeIdentifierConf($db, $this->type);
        $idlabel = escapeIdentifierConf($db, $this->idlabel);
        $id = escapeConf($db, $this->id);

        $qrey = "SELECT * FROM $table WHERE $idlabel = $id";
        $results = executeConf($db, $qrey);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'list') {
        $filters = isset($this->filters)?json_decode($this->filters,true):array(); // ['id'=>123]
        $sortby = isset($this->sortby)?json_decode($this->sortby,true):array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($db, $this->type);

        $results = listWithParamsConf($db, $table, $page, $pagesize, $filters, $sortby);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'count') {
        $filters = isset($this->filters)?json_decode($this->filters,true):array(); // ['id'=>123]
        $sortby = isset($this->sortby)?json_decode($this->sortby,true):array(); //['id'=>'DESC']
        $page = isset($this->page)?$this->page:0;
        $pagesize = isset($this->limit)?$this->limit:0;
        $table = escapeIdentifierConf($db, $this->type);

        $results = listWithParamsConf($db, $table, null, null, $filters, $sortby, true);

        $this->results=$results;
        $this->success=is_array($this->results);
      } else if ($this->verb == 'update') {
        $table = escapeIdentifierConf($db, $this->type);
        $idlabel = escapeIdentifierConf($db, $this->idlabel);
        $id = escapeConf($db, $this->id);

        $data = json_decode($this->data,true);

        $sets = "";

        if (count($data)>0){
          $sets = " SET ";
          $setlist = array();
          foreach($sortby as $key => $val){
            array_push($setlist,escapeIdentifierConf($db,$key) . " = " . escapeConf($db,$val));
          }
          $sets .= implode(", ",$sortedlist);
        }

        $qrey = "UPDATE $table $sets WHERE $idlabel = $id";
        $results = executeConf($db, $qrey);

        $this->results=$results;
        $this->affected=$lastaffected;
        $this->success=true;
      } else if ($this->verb == 'create') {
        $table = escapeIdentifierConf($db, $this->type);

        $data = json_decode($this->data,true);

        $keys = "";
        $vals = "";

        if (is_array($data) && count($data)>0){
          $keylist = array();
          $vallist = array();

          foreach($data as $key => $val){
            array_push($keylist,escapeIdentifierConf($db,$key));
            array_push($vallist,escapeConf($db,$val));
          }

          $keys = implode(",",$keylist);
          $vals = implode(", ",$vallist);
        }

        $qrey = "INSERT INTO $table ($keys) VALUES($vals);";
        $results = executeConf($db, $qrey);

        if ($results){
          $this->results=$results;
          $this->affected=$lastaffected;
          $this->insertid=$lastid;
          $this->success=true;
        }
        else{
          $this->err='INSERT FAILED ' . json_encode($results);
          $this->success=false;
        }
      } else if ($this->verb == 'delete') {
        if ($this->seclevel>=100){
          $table = escapeIdentifierConf($db, $this->type);
          $idlabel = escapeIdentifierConf($db, $this->idlabel);
          $id = escapeConf($db, $this->id);

          $qrey = "DELETE * FROM $table WHERE $idlabel = $id LIMIT 1";
          $results = executeConf($db, $qrey);

          $this->results=$results;
          $this->affected=$lastaffected;
          $this->success=true;
        }
        else{
          $this->success=false;
          $this->err='Security Level Too Low';
        }
      } else if ($this->verb == 'describe') {
        $table = escapeIdentifierConf($db, $this->type);
        $results = describeTableConf($db, $table);
        $this->results=$results;
        $this->affected=$lastaffected;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'tables') {
        $database = isset($this->database)?escapeIdentifierConf($db, $this->database):null;
        $results = listTablesConf($db, $database);
        $this->results=$results;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'indexes') {
        $table = escapeIdentifierConf($db, $this->type);
        $results = listIndexedConf($db, $table);
        $this->results=$results;
        $this->success=is_array($this->results);;
      } else if ($this->verb == 'arbitrary') {
        if ($username==$masterUsername){
          $qrey = $this->query;
          $results = executeConf($db, $qrey);
          $this->results=$results;
          $this->affected=$lastaffected;
        }
      } else {
        $this->err = 'unknown verb';
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

      $this->authenticate();

      return $this->request();
    }

    public function toReturnArray() {
      global $dberrors;
      $ret = array();
      if (isset($this->results))
        $ret['RESULTS']=$this->results;
      if (isset($this->success))
        $ret['SUCCESS']=$this->success;
      if (isset($this->err))
        $ret['ERROR']=$this->err;
      if (isset($this->insertid))
        $ret['INSERTID']=$this->insertid;
      if (isset($this->affected))
        $ret['AFFECTED']=$this->affected;
      if (isset($dberrors) && count($dberrors) > 0)
        $ret['SQLERRORS']=$dberrors;
      return $ret;
    }
  }
  $tmp = new request(getPostOrJsonBody());
  $tmpo = $tmp->toReturnArray();
  echo(json_encode(fixArray($tmpo)));
?>