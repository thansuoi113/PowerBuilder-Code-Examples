Release Notes for PBCrypto Library for PowerBuilder[R] Version 10.5
(c)2006 Sybase, Inc. and its subsidiaries. All rights reserved.
Updated 01/26/2006
*********************************************************************
The PBCrypto Library feature exposes common cryptographic methods 
primarily intended for exposure inside PowerBuilder.

To use this feature in Powerscript, you must:

1. Include the following JAR files in your CLASSPATH system environment
   variable:
   
	jce.jar
	pbcrypto-1_0.jar 
	bcprov-jdk14-119.jar 
	
2. Add the following files to the library list of your PoweBuilder 
   target:

	pbcryptoclient105.pbd 
	pbejbclient105.pbd 

To run the demo application, you must also add the pbcrypto_demo.pbl to
your PowerBuilder target's library list.

To handle PBCrypto exceptions, it is strongly recommended that you use 
TRY-CATCH blocks in your PowerScript code.

You can find the files that you need in the following locations:

File                    Location
-----------------------------------------------------------------------
jce.jar                 Part of the JDK 1.4.x installation. Available 
                        in Sybase\Shared\PoweBuilder\jdk14
pbcrypto-1_0.jar        Sybase\PowerBuilder 10.5\Cryptograph
pbcryptoclient105.pbd   Sybase\PowerBuilder 10.5\Cryptograph
pbcrypto_demo.pbl       Sybase\PowerBuilder 10.5\Cryptograph\demo
bcprov-jdk14-119.jar    Can be downloaded from
                        ftp://ftp.bouncycastle.org/pub/release1.19/

**********************************************************************
(c) 2006 Sybase, Inc. and its subsidiaries. All rights reserved. 
Sybase, Inc. and its subsidiaries ("Sybase") claim copyright in this 
program and documentation as an unpublished work, versions of which 
were first licensed on the date indicated in the foregoing notice. 
Claim of copyright does not imply waiver of Sybase's other rights. 
See Notice of Proprietary Rights.

NOTICE OF PROPRIETARY RIGHTS

This computer program and documentation are confidential trade 
secrets and the property of Sybase, Inc. and its subsidiaries. 
Use, examination, reproduction, copying, disassembly, decompilation, 
transfer and/or disclosure to others, in whole or in part, are 
strictly prohibited except with the express prior written consent of 
Sybase, Inc. and its subsidiaries.
