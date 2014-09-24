
// initialize ourselves when the page is
// finished loading
window.onload = initialize;

/** Our function that initializes when the page
    is finished loading. */
function initialize() {
   // initialize the DHTML History framework
   dhtmlHistory.initialize();
   
   // add ourselves as a DHTML History listener
   dhtmlHistory.addListener(handleHistoryChange);

   // if we haven't retrieved the address book
   // yet, grab it and then cache it into our
   // history storage
   if (window.addressBook == undefined) {
      // Store the address book as a global
      // object.
      // In a real application we would remotely
      // fetch this from a server in the
      // background.
      window.addressBook =
         ["Brad Neuberg 'bkn3@columbia.edu'",
          "John Doe 'johndoe@example.com'",
          "Deanna Neuberg 'mom@mom.com'"];
          
      // cache the address book so it exists
      // even if the user leaves the page and
      // then returns with the back button
      historyStorage.put("addressBook",
                         addressBook);
   }
   else {
      // fetch the cached address book from
      // the history storage
      window.addressBook = 
               historyStorage.get("addressBook");
   }

   // subscribe to mouse clicks on the menu
   var menu = document.getElementById("menu");
   if (typeof window.attachEvent != "undefined") {
      // Internet Explorer
      menu.attachEvent("onclick", 
                       handleMouseClick);
   }
   else { // W3C standards
      menu.addEventListener("click", 
                            handleMouseClick,
                            false);
   }
   
   // determine what our initial location is
   // by retrieving it from the browser's
   // location after the hash
   var currentLocation = 
      dhtmlHistory.getCurrentLocation();
      
   // if there is no location then display
   // the default, which is the inbox
   if (currentLocation == "") {
      currentLocation = "section:inbox";
   }
   
   // extract the section to display from
   // the initial location 
   currentLocation = 
         currentLocation.replace(/section\:/, "");
   
   // display this initial location
   displayLocation(currentLocation, null);
}

/** Handles history change events. */
function handleHistoryChange(newLocation, 
                             historyData) {
   // if there is no location then display
   // the default, which is the inbox
   if (newLocation == "") {
      newLocation = "section:inbox";
   }
   
   // extract the section to display from
   // the location change; newLocation will
   // begin with the word "section:" 
   newLocation = 
         newLocation.replace(/section\:/, "");
   
   // update the browser to respond to this
   // DHTML history change
   displayLocation(newLocation, historyData);
}

/** Displays the given location in the 
    right-hand side content area. */
function displayLocation(newLocation,
                         sectionData) {
   // get the menu element that was selected
   var selectedElement = 
            document.getElementById(newLocation);
            
   // clear out the old selected menu item
   var menu = document.getElementById("menu");
   for (var i = 0; i < menu.childNodes.length;
                                          i++) {
      var currentElement = menu.childNodes[i];
      // see if this is a DOM Element node
      if (currentElement.nodeType == 1) {
         // clear any class name
         currentElement.className = "";
      }                                       
   } 
   
   // cause the new selected menu item to
   // appear differently in the UI
   selectedElement.className = "selected";
   
   // display the new section in the right-hand
   // side of the screen; determine what 
   // our sectionData is
   
   // display the address book differently by
   // using our local address data we cached
   // earlier
   if (newLocation == "addressbook") {
      // format and display the address book
      sectionData = "<p>Your addressbook:</p>";
      sectionData += "<ul>";
      
      // fetch the address book from the cache
      // if we don't have it yet
      if (window.addressBook == undefined) {
         window.addressBook = 
               historyStorage.get("addressBook");
      }
      
      // format the address book for display
      for (var i = 0; 
               i < window.addressBook.length;
                     i++) {
         sectionData += "<li>"
                        + window.addressBook[i]
                        + "</li>";                  
      }
      
      sectionData += "</ul>";
   }
   
   // If there is no sectionData, then 
   // remotely retrieve it; in this example
   // we use fake data for everything but the
   // address book
   if (sectionData == null) {
      // in a real application we would remotely
      // fetch this section's content
      sectionData = "<p>This is section: " 
         + selectedElement.innerHTML + "</p>";  
   }
   
   // update the content's title and main text
   var contentTitle = 
         document.getElementById("content-title");
   var contentValue =
         document.getElementById("content-value");
   contentTitle.innerHTML = 
                        selectedElement.innerHTML;
   contentValue.innerHTML = sectionData;
}

/** Responds to mouse clicks on the left-hand
    side menu area. */
function handleMouseClick(e) {
   // normalize events
   var evt;
   if (typeof window.event != "undefined") // IE
      evt = window.event;
   else // W3C
      evt = e;
      
   // normalize event target
   var target;
   if (typeof evt.srcElement != "undefined") // IE
      target = evt.srcElement;
   else // W3C
      target = evt.target;
      
   // get the location the user clicked on
   var newLocation = target.id;
   
   // Register a history event so this action
   // gets recorded in the browser; Internet
   // Explorer has a bug that prevents us
   // from setting a location value if there
   // are ANY HTML elements in the document that
   // have the same ID already. For example,
   // if we tell dhtmlHistory to add the location
   // 'inbox' to our browser's history, and there
   // is an element in the document with the ID
   // 'inbox', then Internet Explorer will 
   // misbehave. We must accomodate this problem
   // in IE by changing the location so it does
   // not match a pre-existing HTML id
   var modifiedLocation = "section:" 
                          + newLocation;
   var historyData = "<p>The following location "
                     + "was loaded from our "
                     + "DHTML history: "
                     + modifiedLocation + "</p>";
   dhtmlHistory.add(modifiedLocation, 
                    historyData);
   
   // display this location
   displayLocation(newLocation, null);
}

