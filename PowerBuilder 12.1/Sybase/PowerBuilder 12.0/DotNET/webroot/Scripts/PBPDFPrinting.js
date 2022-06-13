function PDFPrinting_CheckSelections(chkThis, frmThis)
{
	for (i = 0; i < frmThis.elements.length; i++)
	{
		if (frmThis.elements[i].type == "checkbox")
		{
			frmThis.elements[i].checked = chkThis.checked;
		}
	}
}
