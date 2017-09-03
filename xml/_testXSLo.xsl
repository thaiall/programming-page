<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="1.0">
 
<xsl:output method="html" version="5.0" encoding="utf-8" indent="yes"/>

<xsl:template match="/">
<xsl:apply-templates />
</xsl:template>

<xsl:template match="p">
<h3 style="color:red"><xsl:value-of select="text()" /></h3>
</xsl:template>

</xsl:stylesheet>

<!-- Source code from https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9484576/ -->

