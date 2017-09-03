<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl" version="1.0">
<xsl:template match="/">
<xsl:for-each select="employee/empl">
<xsl:value-of/><br/> 
<!-- 
<xsl:value-of select="emplid" /> : get emplid
<xsl:value-of select="*" /> : get only first field from all records
<xsl:value-of/> : can use in ie (all fields and all records if use NS:WD-xsl) but fail on other browser   
--> 
</xsl:for-each>
</xsl:template>  
</xsl:stylesheet>
