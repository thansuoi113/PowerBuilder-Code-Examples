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

function PBSet_Get(nIndex) 
{
	return this.Contents[nIndex];
}

function PBSet_Put(oElement) 
{
	if (!this.Contains(oElement)) 
		this.Contents[this.Contents.length] = oElement;
}

function PBSet_PutAt(nIndex, oElement) 
{
	for (var i = this.Contents.length - 1;i >= nIndex; i--) 
	{
		this.Contents[i+1] = this.Contents[i];
	}
	this.Contents[nIndex] = oElement;
}

function PBSet_Contains(oElement) 
{
	return this.IndexOf(oElement) != -1;
}

function PBSet_IndexOf(oElement) 
{
	for (var i = 0;i < this.Contents.length; i++) 
	{
		if (this.Contents[i] == oElement) 
		{
			return i;
		}
	}
	return -1;
}

function PBSet_Remove(oElement) 
{
	var index = this.IndexOf(oElement);
	if (index != -1) 
	{
		for (var i = index; i < this.Contents.length - 1; i++) 
		{
			this.Contents[i] = this.Contents[i + 1];
		}
		this.Contents.length = this.Contents.length - 1;
	}
}

function PBSet_Size() 
{
	return this.Contents.length;
}

function PBSet() 
{
	this.Contents = new Array();
	this.Put = PBSet_Put;
	this.PutAt = PBSet_PutAt;
	this.Contains = PBSet_Contains;
	this.Get = PBSet_Get;
	this.IndexOf = PBSet_IndexOf;
	this.Remove = PBSet_Remove;
	this.Size = PBSet_Size;
}

function PBMap_Get(oKey) 
{
	if (this.Keys.Contains(oKey)) 
	{
		return this.Values[oKey];
	}
	else 
	{
		return null;
	}
}

function PBMap_KeySet()
{
	return this.Keys;
}

function PBMap_Put(oKey, oValue) 
{
	this.Keys.Put(oKey);
	this.Values[oKey] = oValue;
}

function PBMap_PutAt(nIndex, oKey, oValue)
{
	this.Keys.PutAt(nIndex, oKey);
	this.Values[oKey] = oValue;
}

function PBMap_Remove(oKey) 
{
	if (this.Keys.Contains(oKey))
	{
		this.Keys.Remove(oKey);
		this.Values[oKey] = null;
	}
}

function PBMap_Size() 
{
	return this.Keys.Size();
}

function PBMap() 
{
	this.Keys = new PBSet();
	this.Values = new Array();
	this.Get = PBMap_Get;
	this.KeySet = PBMap_KeySet;
	this.Put = PBMap_Put;
	this.PutAt = PBMap_PutAt;
	this.Remove = PBMap_Remove;
	this.Size = PBMap_Size;
}

var RadMenuMap = new PBMap();
