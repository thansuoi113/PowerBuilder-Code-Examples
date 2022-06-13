Release Notes for PowerBuilder[R] Version 15.0 Beta.
(c) 2013 SAP AG or an SAP affiliate company. All rights reserved.
Updated 11/11/2013.
*********************************************************************
This is a Beta release of PowerBuilder 15.0.

Read this document to learn about last-minute updates to the product.

Section I:   Installation Information

Section II:  General Information

Section III: Updated Functionality in this Release
	      		
Section IV:  Known Issues
              PowerBuilder .NET IDE Issue
              OData Data Source Issues
              Docking Window Issue
 
Section V:   Beta Documentation 

Section VI:  Third Party Software Licenses

===================================
Section I: Installation Information
===================================
For information about installing this release, see the PB150Install.txt 
file in the same directory as the common setup program. 


===============================
Section II: General Information
===============================
PowerBuilder 15.0 introduces new features for the PowerBuilder Classic 
and PowerBuilder .NET IDEs.


==================================================
Section III: Updated Functionality in this Release
==================================================
The PowerBuilder team appreciates your participation in this release and 
especially welcomes your feedback on the features listed in this section.

* OData Data Source

* Native 64-bit Support

* MDI Docking Windows

Please note that the RichTextEdit control, the RichText DataWindow, 
and the RichText column in DataWindows will not work in the Beta 
release of the PowerBuilder Classic IDE, native applications, or 
Windows Forms applications.

========================
Section IV: Known Issues
========================
This section lists known issues for specific features and controls 
that are otherwise enabled in the Beta release. 

PowerBuilder .NET IDE Issue
===========================
Cannot create target under root path of logical disk
----------------------------------------------------
If you create a target under the root path of a logical disk (for 
example, the C:\ drive), the New dialog is blank, the PowerBuilder 
tree is not there, and the items in the Target drop-down list are 
incorrect. If you select "(Not Applicable)", an exception occurs 
and you cannot use the IDE. You must restart. [CR 737671]

OData Data Source Issues
========================
RadioButton edit style does not work in the Database Painter
------------------------------------------------------------
If you create a RadioButton edit style and apply it to a column 
in the Database Painter for an OData data source, nothing happens 
when you select it in the table. It does work in the DataWindow 
Painter. [CR 737342]

Binary data displays incorrectly in Database and DataWindow Painters
--------------------------------------------------------------------
Binary data in an OData data source displays in the Database and 
DataWindow painters as "System.Byte[]" instead of the actual database 
values. [CR 726006]

Continuous retrieve fails for DataWindow and Database Painters or Runtime
-------------------------------------------------------------------------
In the DataWindow Painter, Database Painter, and at runtime, PowerBuilder 
does not retrieve all the rows from an OData data source if the OData 
service returns the data in batches. It retrieves only the first batch 
of the rows. [CR 737659] 

Docking Window Issue
====================
Two docking window properties do not work with Classic Windows theme
--------------------------------------------------------------------
The TabbedDocumentTabColorsUseTheme and TabbedWindowTabCoorsUseTheme
properies do not show the correct colors when the Windows theme is 
set to Classic. [CR 749884]


=============================
Section V: Beta Documentation
=============================
Only minor changes have been made to the PowerBuilder Classic 
and PowerBuilder .NET help in this release.  


=========================================
Section VI: Third-Party Software Licenses
=========================================

PowerBuilder applications have some dependencies on third-party 
components that are installed with PowerBuilder. Most of these 
components are not installed with the PowerBuilder Runtime Packager. 
You can redistribute some of these components with your application, 
but others must be obtained from the vendor.

For information about components that can be freely downloaded, see 
the free download terms document for PowerBuilder. A copy of this 
document is available from links on the Sybase Web site at 
http://www.sybase.com/softwarelicenses/third_party_legal. Third party 
licenses for distributable components are included in the Support 
directory in the Beta Update ZIP file.

*********************************************************************
(c) 2013 SAP AG or an SAP affiliate company. All rights reserved. 
SAP AG and its affiliate companies ("SAP") claim copyright in this 
program and documentation as an unpublished work, versions of which 
were first licensed on the date indicated in the foregoing notice. 
Claim of copyright does not imply waiver of SAP's other rights. 
See Notice of Proprietary Rights.

NOTICE OF PROPRIETARY RIGHTS

This computer program and documentation are confidential trade 
secrets and the property of SAP AG or an SAP affiliate company. 
Use, examination, reproduction, copying, disassembly, decompilation, 
transfer and/or disclosure to others, in whole or in part, are 
strictly prohibited except with the express prior written 
consent of SAP AG or an SAP affiliate company.
