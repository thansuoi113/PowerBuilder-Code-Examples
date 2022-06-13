Option Explicit
dim ArgComputer,ArgWebSitesvPath,vPath,vPaths,scriptPath,vBaseName,vServiceID
ArgComputer = Wscript.Arguments.Item(0)
vBaseName =Wscript.Arguments.Item(1)
vServiceID=Wscript.Arguments.Item(2)

ArgWebSitesvPath = "Default Web Site"
vPath = left(Wscript.ScriptFullName,len(Wscript.ScriptFullName ) - len(Wscript.ScriptName))
vPaths = Array(vPath)

CreateVDir  ArgComputer, ArgWebSitesvPath, vPaths, vBaseName

Sub CreateVDir( ComputerName, WebSiteName, vPaths, vBaseName)
Dim vRoot,vBaseDir,vDir,vTempDir,webSite
On Error Resume Next

set webSite = GetObject("IIS://"+ArgComputer+"/w3svc/"+vServiceID)
if IsObject(webSite)=False then
Display "Unable to locate the Default Web Site.IIS must be installed"
exit sub
end if
set vRoot = webSite.GetObject("IIsWebVirtualDir","Root")
Err.Number = 0
Set vBaseDir = GetObject(vRoot.ADsPath & "/"& vBaseName)
if Err.Number <> 0 then
Err.Number = 0
Set vBaseDir = vRoot.Create("IIsWebVirtualDir",vBaseName)
vBaseDir.AccessRead = true
vBaseDir.Accessflags = 529
vBaseDir.AppCreate False
vBaseDir.SetInfo
end if
End Sub
