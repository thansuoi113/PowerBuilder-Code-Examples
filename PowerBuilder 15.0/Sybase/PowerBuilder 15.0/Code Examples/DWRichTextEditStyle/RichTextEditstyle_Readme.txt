To run the RichTextEditDemo application, you must first create the RTEDemo table in the demonstration database and insert values for it from a SQL script:

1. Start PowerBuilder and open the RTE.PBW workspace.

2. From the Database Profiles Painter, select the correct EAS Demo DB profile, and click Connect.

3. Open the Database painter.

4. Select File>Open File for the Database painter menu, then select the rtedemo.sql file to display it in the ISQL view of the Database painter.

5. Select "Design --> Execute ISQL" to run the SQL, or select the "Execute" button in PainterBar2. 

You execute the script only once . After the script is successfully executed, you can run the application at any time to explore the capabilities of the RichText edit feature for DataWindow columns. The RTE workspace contains two targets with the RichText demo: one for a standard client-server application, and the other for a .NET Windows Forms application.