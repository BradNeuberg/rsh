// x_dom.js, X v3.15.2, Cross-Browser.com DHTML Library
// Copyright (c) 2004 Michael Foster, Licensed LGPL (gnu.org)

// IE doesn't define DOM constants for W3C Node object, so you have to hard
// code constants.  This creates Node object on browsers without for easier
// coding when working with nodeType attribute.  Brad Neuberg.
if (Node == null || Node == undefined) {
	var Node = new Object();
		
    Node.ELEMENT_NODE                   = 1;
    Node.ATTRIBUTE_NODE                 = 2;
    Node.TEXT_NODE                      = 3;
    Node.CDATA_SECTION_NODE             = 4;
    Node.ENTITY_REFERENCE_NODE          = 5;
    Node.ENTITY_NODE                    = 6;
    Node.PROCESSING_INSTRUCTION_NODE    = 7;
    Node.COMMENT_NODE                   = 8;
    Node.DOCUMENT_NODE                  = 9;
    Node.DOCUMENT_TYPE_NODE             = 10;
    Node.DOCUMENT_FRAGMENT_NODE         = 11;
    Node.NOTATION_NODE                  = 12;
}

function xWalkTree(oNode, fnVisit)
{
  if (oNode) {
    if (oNode.nodeType == 1) {fnVisit(oNode);}
    for (var c = oNode.firstChild; c; c = c.nextSibling) {
      xWalkTree(c, fnVisit);
    }
  }
}
function xGetComputedStyle(oEle, sProp)
{
  var p = 0;
  if(document.defaultView && document.defaultView.getComputedStyle){
    p = document.defaultView.getComputedStyle(oEle,'').getPropertyValue(sProp)
  }
  else if(oEle.currentStyle) {
    // convert css property name to object property name for IE
    var a = sProp.split('-');
    sProp = a[0];
    for (var i=1; i<a.length; ++i) {
      c = a[i].charAt(0);
      sProp += a[i].replace(c, c.toUpperCase());
    }
    p = oEle.currentStyle[sProp];
  }
  return parseInt(p) || 0;
}
function xGetElementsByClassName(clsName, parentEle, tagName, fn)
{
  var found = new Array();
  var re = new RegExp('\\b'+clsName+'\\b', 'i');
  var list = xGetElementsByTagName(tagName, parentEle);
  for (var i = 0; i < list.length; ++i) {
    if (list[i].className.search(re) != -1) {
      found[found.length] = list[i];
      if (fn) fn(list[i]);
    }
  }
  return found;
}
/** Walks this elements parent hierarchy until it comes to one that has
    the given class name.  It returns the one parent element that has this
    name.
  */
xGetParentElementByClassName = function(target, className) {
    var tg = target;
    while (tg && xHasClassName(tg, className) == false) {
        tg = tg.parentNode;
    }

    return tg;
}
/** Gets just the first element that has the given class name.  If no element
    with that name exists then null is returned.
  */
xGetSingleElementByClassName = function(target, className, tagName) {
    var results = xGetElementsByClassName(className, target, tagName);
    if (results == null || results.length == 0) {
        return null;
    }
    else {
        return results[0];
    }
}
function xGetElementsByTagName(tagName, parentEle)
{
  var list = null;
  tagName = tagName || '*';
  parentEle = parentEle || document;
  if (xIE4 || xIE5) {
    if (tagName == '*') list = parentEle.all;
    else list = parentEle.all.tags(tagName);
  }
  else if (parentEle.getElementsByTagName) list = parentEle.getElementsByTagName(tagName);
  return list || new Array();
}
function xGetElementsByAttribute(sTag, sAtt, sRE, fn) {
  var a, list, found = new Array(), re = new RegExp(sRE, 'i');
  list = xGetElementsByTagName(sTag);
  for (var i = 0; i < list.length; ++i) {
    a = list[i].getAttribute(sAtt);
    if (!a) {a = list[i][sAtt];}
    if (typeof(a)=='string' && a.search(re) != -1) {
      found[found.length] = list[i];
      if (fn) fn(list[i]);
    }
  }
  return found;
}
function xCreateElement(sTag) {
  if (document.createElement) return document.createElement(sTag);
  else return null;
}
function xAppendChild(oParent, oChild) {
  if (oParent.appendChild) return oParent.appendChild(oChild);
  else return null;
}
function xRemoveNode(oParent, oNode) {
  return oParent.removeChild(oNode);
}