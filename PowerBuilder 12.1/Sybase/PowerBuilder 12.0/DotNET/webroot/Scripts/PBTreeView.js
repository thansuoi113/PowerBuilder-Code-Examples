//**************************************************************************
//		Copyright  Sybase, Inc. 2004-2006
//						 All Rights reserved.
//
//	Sybase, Inc. ("Sybase") claims copyright in this
//	program and documentation as an unpublished work, versions of
//	which were first licensed on the date indicated in the foregoing
//	notice.  Claim of copyright does not imply waiver of Sybase's
//	other rights.
//
//	 It is provided subject to the terms of the Sybase License Agreement
//	 for use as is, without alteration or modification.  
//	 Sybase shall have no obligation to provide support or error correction 
//	 services with respect to any altered or modified versions of this code.  
//
//       ***********************************************************
//       **     DO NOT MODIFY OR ALTER THIS CODE IN ANY WAY       **
//       ***********************************************************
//
//       ***************************************************************
//       ** IMPLEMENTATION DETAILS SUBJECT TO CHANGE WITHOUT NOTICE.  **
//       **            DO NOT RELY ON IMPLEMENTATION!!!!		      **
//       ***************************************************************
//**************************************************************************
var c;
var timerID = "";

function PBTreeView()
{
    this.strUniqueID = "";
    this.oCurrentNode = null;
}

function PBTreeViewManager_Get(strID)
{
	return this.TreeViews.Get(strID);
}

function PBTreeViewManager_Add(strID, oTreeView)
{
	this.TreeViews.Put(strID, oTreeView);
}
	
function PBTreeViewManager_GetIDs()
{
	return this.TreeViews.KeySet();
}

function PBTreeViewManager_Count() 
{
	return this.TreeViews.Size();
}

function PBTreeViewManager_Register(strID, strWinID, strUniqueID) 
{
    var oTreeView = new PBTreeView();
    oTreeView.strUniqueID = strUniqueID;
    var oRadTreeview = eval(strID);
    if (oRadTreeview)
    {
    	oTreeView.oCurrentNode = oRadTreeview.SelectedNode;
	}
    this.Add(strID, oTreeView);   
}

function PBTreeViewManager_GetData(strID)
{
   this.strID = strID;
   var oTreeView = this.Get(strID);
   this.strUniqueID = oTreeView.strUniqueID;

   return oTreeView;
}

function PBTreeViewManager_GetNodeIndex(node)
{    
    if ( node == undefined || node == null )
        return strIdx;
    var strIdx = "" + node.Index;
    while ( node.Parent != null && node.Parent.Index != undefined )
    {
        node = node.Parent;
        strIdx = node.Index +"." + strIdx;
    } 
    return strIdx;
}

function PBTreeViewManager_TVIndexChanged(strID)
{
    this.GetData(strID);
    var tree = this.GetTreeHandle(strID);
    
    if (tree == null || tree == undefined)
        return;
    
    __doPostBack(this.strUniqueID, "IndexChanged," + tree.selectedNodeIndex);
}

function PBTreeViewManager_radTIndexChanged(node, eventArg)
{
    if ( !node.Enabled ) return;
    this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
    __doPostBack(this.strUniqueID, "IndexChanged," + this.GetNodeIndex(node));
}
// Intercepts the collapsed event on the client.
function PBTreeViewManager_TVNodeExpand(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    var tree = this.GetTreeHandle(strID);
    if (tree == null || tree == undefined)
        return;    
    
    if (tree.showPlus)
    {
		__doPostBack(this.strUniqueID, "Expand," + event.treeNodeIndex);
	}
	else
	{
		this.bExpanded = true;
	}
}

function PBTreeViewManager_radTNodeExpand(node, eventArg)
{
    if ( !node.Enabled ) return;
	this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
   
    if ( node.Expanded == false )
    {
		__doPostBack(this.strUniqueID, "Expand," + this.GetNodeIndex(node));
	}
	else
	{
		__doPostBack(this.strUniqueID, "Collapse," + this.GetNodeIndex(node));
	}
}
// Intercepts the collapsed event on the client.
function PBTreeViewManager_TVNodeCollapse(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    var tree = this.GetTreeHandle(strID);
    if (tree == null || tree == undefined)
        return;
        
    if (tree.showPlus)
    {
		__doPostBack(this.strUniqueID, "Collapse," + event.treeNodeIndex);
	}
}

function PBTreeViewManager_TVNodeCheck(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    __doPostBack(this.strUniqueID, "Check," + event.treeNodeIndex);
}

function PBTreeViewManager_radTNodeCheck(node, eventArg)
{
    if ( !node.Enabled ) return;
    this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
    __doPostBack(this.strUniqueID, "Check," + this.GetNodeIndex(node));
}
function PBTreeViewManager_TVNodeClick(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    var tree = this.GetTreeHandle(strID);
    if (tree == null || tree == undefined)
        return;
    
    if (this.bExpanded)
	{
		if (timerID != null && timerID != undefined)
			clearTimeout(timerID);
		
		__doPostBack(this.strUniqueID, "DblClick," + tree.selectedNodeIndex);
	}
	else
	{
		__doPostBack(this.strUniqueID, "Click," + tree.selectedNodeIndex + ",");
	}
}

function radTDeferredClick(nodeExp, nodeIdx, strID)
{
    __doPostBack(strID, "Click," + nodeIdx + ",");
}

function PBTreeViewManager_radAfterTNodeHighlight(node)
{
	if ( !node.Enabled ) return;
	
	var oTreeview = this.GetData(node.TreeView.ClientID);
	if (oTreeview)
	{
		if (oTreeview.oCurrentNode == node.TreeView.SelectedNode)
			return;
	
		if (oTreeview.oCurrentNode == node)
			return;
	
		if (oTreeview.oCurrentNode)
		{
			oTreeview.oCurrentNode.TextElement().style.color = document.getElementById(node.TreeView.ClientID).style.color;
		}
		
		oTreeview.oCurrentNode = node.TreeView.SelectedNode;
		oTreeview.oCurrentNode.TextElement().style.color = "white";
	}
}

function PBTreeViewManager_radTNodeClick(node, eventArg)
{
    if ( !node.Enabled ) return;
    this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
    var nodeIdx = this.GetNodeIndex(node);
    if (node.Expanded == true)
	{
		timerID = window.setTimeout("radTDeferredClick(true,'"+nodeIdx+"','" + this.strUniqueID + "');", 300);
	}
	else
	{
		timerID = window.setTimeout("radTDeferredClick(false,'"+nodeIdx+"','" + this.strUniqueID + "');", 300);
	}
}
// Intercepts the double-click event on the client.
function PBTreeViewManager_TVDoubleClick(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    var tree = this.GetTreeHandle(strID);
    if (tree == null || tree == undefined)
        return;

	 if (timerID != null && timerID != undefined)
		clearTimeout(timerID);
		
    __doPostBack(this.strUniqueID, "DblClick," + tree.selectedNodeIndex);
}
function PBTreeViewManager_radTDoubleClick(node, eventArg)
{
    if ( !node.Enabled ) return;
    this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
     if (timerID != null && timerID != undefined)
		clearTimeout(timerID);
    __doPostBack(this.strUniqueID, "DblClick," + this.GetNodeIndex(node));
}

// Intercepts the right-click event on the client. The selected 
// tree node is changed to the node over which the end user has 
// right-clicked so that, that node's meta-data can be obtained.
function PBTreeViewManager_TVRightClick(strID)
{
    this.GetData(strID);
    goWindowManager.OnFocusOwn(strID);
    __doPostBack(this.strUniqueID, "RightClick," + event.treeNodeIndex);
}
function PBTreeViewManager_radTRightClick(node, eventArg)
{
    if ( !node.Enabled ) return;
    this.GetData(node.TreeView.ClientID);
    goWindowManager.OnFocusOwn(node.TreeView.ClientID);
    __doPostBack(this.strUniqueID, "RightClick," + this.GetNodeIndex(node));
}
// Gets a handle to the TreeView.
function PBTreeViewManager_GetTreeHandle(strID)
{
    // Get a handle to the TreeView.
    var oTreeView = document.getElementById(strID);
    
    if (oTreeView == null || oTreeView == undefined)
        return null;
    
    return oTreeView;
}     

function PBTreeViewManager()
{
    this.strID = "";
    this.strUniqueID = "";
    this.bExpanded = false;
    this.bCollapsed = false;
    this.TreeViews = new PBMap();
    this.Get = PBTreeViewManager_Get;
    this.Add = PBTreeViewManager_Add;
    this.GetIDs = PBTreeViewManager_GetIDs;
    this.Count = PBTreeViewManager_Count;
    this.Register = PBTreeViewManager_Register;
    this.GetData = PBTreeViewManager_GetData;
    this.GetNodeIndex = PBTreeViewManager_GetNodeIndex;
    this.GetTreeHandle = PBTreeViewManager_GetTreeHandle;
    this.TVRightClick = PBTreeViewManager_TVRightClick;
    this.radTRightClick = PBTreeViewManager_radTRightClick;
    this.TVDoubleClick = PBTreeViewManager_TVDoubleClick;
    this.radTDoubleClick = PBTreeViewManager_radTDoubleClick;
    this.TVIndexChanged = PBTreeViewManager_TVIndexChanged;
    this.radTIndexChanged = PBTreeViewManager_radTIndexChanged;
    this.TVNodeCollapse = PBTreeViewManager_TVNodeCollapse;
    this.TVNodeExpand = PBTreeViewManager_TVNodeExpand;
    this.radTNodeExpand = PBTreeViewManager_radTNodeExpand;
    this.TVNodeCheck = PBTreeViewManager_TVNodeCheck;
    this.radTNodeCheck = PBTreeViewManager_radTNodeCheck;
    this.TVNodeClick = PBTreeViewManager_TVNodeClick;
    this.radTNodeClick = PBTreeViewManager_radTNodeClick;
    this.radAfterTNodeHighlight = PBTreeViewManager_radAfterTNodeHighlight;
}

var goTreeViewManager = new PBTreeViewManager();

function PB_RadTreeViewStyleReset(treeviewID)
{
	var oTreeView = document.getElementById(treeviewID);
	var cursor = oTreeView.style.cursor;
	if (cursor == "")
	{
		cursor = "default";
	}
	else if (cursor.substring(0, 3) == "url")
	{
		cursor = cursor.substring(5, cursor.length - 2);
	}

	var aTags = oTreeView.getElementsByTagName("span");
	if (aTags)
	{
		var bold = oTreeView.style.fontWeight == "bold" || oTreeView.style.fontWeight == "700";
		var fontSize = oTreeView.style.fontSize;
		var underline = oTreeView.style.textDecoration;
		var color = oTreeView.style.color;

		for (var i = 0; i < aTags.length; i++)
		{
			aTags[i].style.fontSize = fontSize;

			if (bold)
			{
				aTags[i].style.fontWeight = "bold";
			}

			if (underline)
			{
				aTags[i].style.textDecoration = underline;
			}

			aTags[i].style.cursor = cursor;
			
			if (color)
			{
				if (aTags[i].className == "TreeNodeSelect")
				{
					aTags[i].style.color = "white";
				}
				else
				{
					aTags[i].style.color = color;
				}
			}
		}
	}

	aTags = oTreeView.getElementsByTagName("img");
	if (aTags)
	{
		for (var i = 0; i < aTags.length; i++)
		{
			aTags[i].style.cursor = cursor;
		}
	}
}

PB_AjaxJsLoaded();
