# **************************************************************************
#
#                            Copyright 1992
#                            Powersoft Corp.
#
#    ALL RIGHTS RESERVED.  NO PORTION OF THIS MATERIAL MAY BE COPIED
#    IN ANY WAY WITHOUT PRIOR WRITTEN CONSENT FROM COMPUTER SOLUTIONS
#    INCORPORATED.
#
# --------------------------------------------------------------------------
#
#    Filename : makefile
#
#    Author   : Jane Cantz
#
#    Purpose  : Make file for generating PB Example Libraries
#
# **************************************************************************

#
# Local macro definitions
#

PSNAME = PBEX
PSTYPE = IDL

.IF "$(PSJPN)" != ""
SUFFIX32 =J
PSBLD32  = $(MYPBDIR)\build\nt\jpn
TARGET   =$(PSBLD32)\examples\pbexamfe.pbl
LANGDEF  =/DPS_DBCS /DPS_JPN
PSTGTDIR =
# ADC_DBCS_START_MODIFY cchong Jul 6 1999
.ELSIF "$(PSDBCS)" != ""
SUFFIX32 =
PSBLD32  = $(MYPBDIR)\build\nt
TARGET   =$(PSBLD32)\examples\pbexamfe.pbl
HELPDIR  = ..\..\help\pb\nt
LANGDEF  =/DPS_DBCS
PSTGTDIR =nt
# ADC_DBCS_END_MODIFY cchong Jul 6 1999
.ELSIF "$(PSUNICODE)" != ""
SUFFIX32 =U
PSBLD32  = $(MYPBDIR)\build\unicode
TARGET   =$(PSBLD32)\examples\pbexamfe.pbl
HELPDIR  = $(MYPBDIR)\help\pb\unicode
LANGDEF  =/DPS_UNICODE
PSTGTDIR =unicode
.ELSE
SUFFIX32 =
PSBLD32  = $(MYPBDIR)\build\nt
TARGET   =$(PSBLD32)\examples\pbexamfe.pbl
HELPDIR  = $(MYPBDIR)\help\pb\nt
LANGDEF  =
PSTGTDIR =$(PSTGTOS)
.END

# Add localization define
.IF "$(RTLANG)"!=""
LANGDEF += /DPS_$(RTLANG)
.END

MYGENONLY	= HERE
MYCLEAN		= HERE
MYLINKONLY  	= HERE

.IF $(ARCHFILE)
.INCLUDE: $(ARCHFILE)
.ELSE
.INCLUDE: $(MYPBDIR)\ARCH\$(PSTGTOS)$(PSCOMP).A
.END

genonly  : _exam$(SUFFIX32)$(RTLANG).dat
linkonly : "$(TARGET)"

# Create the orcascript source
_exam$(SUFFIX32)$(RTLANG).dat : exam.dat
	cl /nologo /C /EP /P /DPBWIN32 /DPBOS_NT $(LANGDEF) exam.dat
	mv exam.i _exam$(SUFFIX32)$(RTLANG).dat

# Run the orcascript source
"$(TARGET)" : _exam$(SUFFIX32).dat

	echo Source Prep Examples Source Dir
	"$(COMSPEC)" /C 'attrib -r /S *.*'
	
	echo Copying PB Example Source to build directory
	"$(COMSPEC)" /C 'xcopy "*.*" "$(PSBLD32)\examples\*.*" /s'

	echo Migrating or Converting PB Examples
	
.IF "$(PSUNICODE)" != ""
	$(MYPBDIR)\runtime\typdef\obj\unicode\orcascr.exe _exam$(SUFFIX32)$(RTLANG).dat
.ELSE
	$(MYPBDIR)\runtime\typdef\obj\nt\orcascr.exe _exam$(SUFFIX32)$(RTLANG).dat
.END
	echo "Finished PB Examples Generation..."

	"$(COMSPEC)" /C 'copy $(HELPDIR)\examp*.* $(PSBLD32)\examples'
	"$(COMSPEC)" /C 'del $(PSBLD32)\examples\_exam*.*'
	"$(COMSPEC)" /C 'del $(PSBLD32)\examples\exam*.dat'
	"$(COMSPEC)" /C 'del $(PSBLD32)\examples\makefile'
	"$(COMSPEC)" /C 'del $(PSBLD32)\examples\unixmk'

	echo PB EXAMPLES SUCCESSFULLY BUILT


clean :
	"$(COMSPEC)" /C 'rm -f $(PSBLD32)\examples\*'

