<?php


class Newsletter{
    public $id;
    public $title;
    public $text;
    public $date; 

    function __construct($id, $title, $text, $date){

    $this->id=$id;
    $this->title=$title; 
    $this->text=$text; 
    $this->date=$date; 

    }

}


?>