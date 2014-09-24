/** 
   Copyright (c) 2005, Brad Neuberg, bkn3@columbia.edu
   http://codinginparadise.org
   
   Permission is hereby granted, free of charge, to any person obtaining 
   a copy of this software and associated documentation files (the "Software"), 
   to deal in the Software without restriction, including without limitation 
   the rights to use, copy, modify, merge, publish, distribute, sublicense, 
   and/or sell copies of the Software, and to permit persons to whom the 
   Software is furnished to do so, subject to the following conditions:
   
   The above copyright notice and this permission notice shall be 
   included in all copies or substantial portions of the Software.
   
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT 
   OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
   THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** An object that uses a hidden form to store history state 
    across page loads. The chief mechanism for doing so is using
    the fact that browser's save the text in form data for the
    life of the browser and cache, which means the text is still
    there when the user navigates back to the page. See
    http://codinginparadise.org/weblog/2005/08/ajax-tutorial-saving-session-across.html
    for full details. */
window.historyStorage = {
   /** If true, we are debugging and show the storage textfield. */
   /** public */ debugging: false,
   
   /** By default we serialize object's using JSON notation; if
       turn off this can improve performance if you just want to store
       simple types, such as Strings. */
   /** public */ serializeObjects: true,
   
   /** public */ put: function(key, value) {
       this.assertValidKey(key);
       
       // if we already have a value for this,
       // remove the value before adding the
       // new one
       if (this.hasKey(key)) {
         this.remove(key);
       }
       
       // Serialize the value so we can
       // support JavaScript objects.
       var serializedValue = value;
       
       if (this.serializeObjects) {
         serializedValue = JSON.stringify(value);
       }
       
       var newContent =
         "<storage-entry id='" + key + "'>"
            + serializedValue
         + "</storage-entry>\n";
         
       this.storageField.value += newContent; 
   },
   
   /** public */ get: function(key) {
      this.assertValidKey(key);
       
      var content = this.storageField.value;
      var matcher = new RegExp("<storage-entry id='" + key + "'>", "m");
      var startIndex = content.search(matcher);
      if (startIndex == -1)
      	return null;
      	
      // extract all the text after the match position
      var rightMatch = RegExp.rightContext;
      var endIndex = rightMatch.indexOf("</storage-entry>");
      var value = rightMatch.substring(0, endIndex);
      
      if (this.serializeObjects == true) {
         // destringify the value from being a
         // JSON JavaScript object into an actual one.
         value = eval('(' + value + ')');  
      }

      return value; 
   },
   
   /** public */ remove: function(key) {
      this.assertValidKey(key);
      
      var content = this.storageField.value;
      var searchFor = "<storage-entry id='" + key + "'>";
      var matcher = new RegExp(searchFor, "m");
      var startIndex = content.search(matcher);
      if (startIndex == -1)
      	return null;
      	
      // extract all the text after the match position
      var rightMatch = RegExp.rightContext;
      var value = rightMatch.substring(0, rightMatch.indexOf("</storage-entry>"));
      
      var startNew = content.substring(0, startIndex);
      // FIXME: IE seems to be off by one when removing
      // the new line, leaving it present after removal,
      // but adding + 2 at the end instead
      // of "\n".length creates problems on Firefox.
      // This might be because each browser transforms
      // \n into either one or two characters.
      var endIndex = startIndex + searchFor.length
                     + rightMatch.indexOf("</storage-entry>")
                     + "</storage-entry>".length 
                     + "\n".length;
      var endNew = content.substring(endIndex);
      
      content = startNew + endNew;
      this.storageField.value = content; 
      
      return value;  
   },
   
   /** Clears out all saved data. */
   /** public */ reset: function() {
      this.storageField.value = "";
   },
   
   /** public */ hasKey: function(key) {
      this.assertValidKey(key);
      
      var content = this.storageField.value;
      var matcher = new RegExp("<storage-entry id='" + key + "'>", "m");
      var startIndex = content.search(matcher);
      if (startIndex == -1)
      	return false;
      else
         return true;
   },
   
   /** Determines whether the key given is valid;
       keys can only have letters, numbers, the dash,
       underscore, spaces, or one of the 
       following characters:
       !@#$%^&*()+=:;,./?|\~{}[] */
   /** public */ isValidKey: function(key) {
      if (typeof key != "string")
         key = key.toString();
      
      var matcher = 
         /^[a-zA-Z0-9_ \!\@\#\$\%\^\&\*\(\)\+\=\:\;\,\.\/\?\|\\\~\{\}\[\]]*$/;
                     
      return matcher.test(key);
   },
   
   
   
   
   /** A reference to our textarea field. */
   /** private */ storageField: null,
   
   /** private */ init: function() {
      // write a hidden form into the page
      var styleValue = "position: absolute; top: -1000px; left: -1000px;";
      if (this.debugging == true) {
         styleValue = "width: 30em; height: 30em;";
      }   
      
      var newContent =
         "<form id='historyStorageForm' " 
               + "method='GET' "
               + "style='" + styleValue + "'>"
            + "<textarea id='historyStorageField' "
                      + "style='" + styleValue + "'"
                              + "left: -1000px;' "
                      + "name='historyStorageField'></textarea>"
         + "</form>";
      document.write(newContent);
      
      this.storageField = document.getElementById("historyStorageField");
   },
   
   /** Asserts that a key is valid, throwing
       an exception if it is not. */
   /** private */ assertValidKey: function(key) {
      if (this.isValidKey(key) == false) {
         throw "Please provide a valid key for "
               + "window.historyStorage, key= "
               + key;
       }
   }   
};

window.historyStorage.init();
