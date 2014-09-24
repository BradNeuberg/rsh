/* 
   Copyright (c) 2005, Brad Neuberg, 
   bkn3@columbia.edu
   http://codinginparadise.org
   
   Permission is hereby granted, free of charge, 
   to any person obtaining a copy of this software
   and associated documentation files (the
   "Software"), to deal in the Software without 
   restriction, including without limitation 
   the rights to use, copy, modify, merge, 
   publish, distribute, sublicense, and/or sell 
   copies of the Software, and to permit persons 
   to whom the Software is furnished to do so, 
   subject to the following conditions:
   
   The above copyright notice and this 
   permission notice shall be included in all 
   copies or substantial portions of the Software.
   
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT 
   WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
   INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
   PURPOSE AND NONINFRINGEMENT. 
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
   HOLDERS BE LIABLE FOR ANY 
   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
   IN AN ACTION OF CONTRACT, TORT 
   OR OTHERWISE, ARISING FROM, OUT OF OR IN 
   CONNECTION WITH THE SOFTWARE OR 
   THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// initialize ourselves when the page is finished
// loading
window.onload = initialize;

// an array of our topics
var topics = new Array();

function initialize() {
  // initialize the DhtmlHistory
  // framework
  dhtmlHistory.initialize();
  
  // if this is the first time the page
  // has loaded, fetch the list of
  // topics remotely
  if (dhtmlHistory.isFirstLoad()) {
    topics = loadTopics();  
    historyStorage.put("topics", topics);
  }
  else {
    // else, simply extract it from our
    // history storage
    topics = historyStorage.get("topics");
  }
  
  // display our topics list
  displayTopicsList(); 
  
  // initialize our initial state from
  // the browser location after the hash
  var currentTopic = 
        dhtmlHistory.getCurrentLocation(); 
  displayTopic(currentTopic);
  
  // catch when a user clicks on a new
  // topic
  var menu = 
        document.getElementById("menu");
  xAddEventListener(menu, "click",
                    handleTopicChange,
                    false);
  
  // set ourselves up to listen to 
  // history events
  dhtmlHistory.addListener(
                    handleHistoryEvent);
}

function handleHistoryEvent(newLocation,
                            historyData) {
  var topicID = newLocation;
  
  // display this topic
  displayTopic(topicID);                      
}

function handleTopicChange(e) {
  var evt = new xEvent(e);
  var target = evt.target;
  var topicID = target.getAttribute("topicID");
  
  // display this topic
  var content = displayTopic(topicID);
  
  // add this to our history
  dhtmlHistory.add(topicID, content);
  
  // cancel the default behavior of hyperlinks
  return evt.cancel();
}

function displayTopic(topicID) {
  var topic;
  
  // if no topic passed in then get the
  // default topic
  if (topicID == null || 
      topicID == "") {
    for (var i = 0; i < topics.length; 
                                    i++) {
      if (topics[i].isDefault) {
        topic = topics[i];
        break;
      }                                  
    }
  }
  else {
    // fetch the topic with this ID
    for (var i = 0; i < topics.length; 
                                    i++) {
      if (topics[i].id == topicID) {
        topic = topics[i];
        break;
      }
    }
  }
    
  // see if we have cached the contents
  // of this topic in our history storage
  var content;
  if (historyStorage.hasKey(topic.id)) {
    content = historyStorage.get(
                                topic.id);
  }
  else {     
    // get the filename to load
    var url = topic.src;
               
    // load this file synchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    content = request.responseText;
    
    // persist this value into our 
    // history storage
    historyStorage.put(topic.id, content);
  }
  
  // now place this content and title
  // into the HTML
  var topicTitle = 
    document.getElementById("topicTitle");
  topicTitle.innerHTML = topic.title;
  var topicContent =
    document.getElementById(
                          "topicContent");
  topicContent.innerHTML = content;
  
  return content;
}

function loadTopics() {
  // load our remote topics.xml document
  // synchronously into an XML DOM object
  var topicsXML = 
                Sarissa.getDomDocument();
  topicsXML.async = false;
  topicsXML.load("topics.xml");
  
  // parse out our topics from the XML,
  // building up a JavaScript array that
  // mirrors these values
  var topics = new Array();
  var topicElements = 
    topicsXML.getElementsByTagName(
                                "topic");
  for (var i = 0; 
          i < topicElements.length;
          i++) {
    var currentTopic = new Object();
    currentTopic.id =
          topicElements[i].getAttribute(
                                "id");
    currentTopic.title =
          topicElements[i].getAttribute(
                                "title");
    currentTopic.src =
          topicElements[i].getAttribute(
                                "src");
    currentTopic.isDefault =
          topicElements[i].getAttribute(
                             "default");
                               
    if (currentTopic.isDefault == null ||
        currentTopic.isDefault 
                            == undefined)
      currentTopic.isDefault = false;    
    
    // add a toString() method for 
    // debugging 
    currentTopic.toString = function() {
      return "[id="+this.id
             + ", title="+this.title
             + ", src="+this.src
             + ", isDefault="
             + this.isDefault
             + "]";
    };
    
    topics.push(currentTopic); 
  }
  
  return topics;
}

function displayTopicsList() {
  var menu = 
          document.getElementById("menu");
  for (var i = 0; i < topics.length; 
                                i++) {
    // use each topic to update
    // our user interface
    var newTopic = 
          document.createElement("a");
    
    newTopic.href = topics[i].src;
    newTopic.title = topics[i].title;
    // note: avoid using the id attribute of 
    // hyperlinks if they will clash with a
    // location you store into history; if these
    // values are the same you can run into
    // some strange bugs in Internet Explorer;
    // to avoid this, we use setAttribute with
    // a custom attribute named "topicID"
    newTopic.setAttribute("topicID", topics[i].id);
    newTopic.innerHTML = topics[i].title;
    
    menu.appendChild(newTopic);
  }
}
