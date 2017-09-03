<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="/">
<table style="border-width:5px;border-color:blue;border-style:double;padding:5px;margin-left:auto;margin-right:auto;">
<tr style="background-color:#ddffdd;">
<th style="text-align:center;">ID</th>
<th style="text-align:center;">Name</th>
<th style="text-align:center;">Salary</th>
</tr>
<xsl:for-each select="employee/empl">	
<tr>
<td><xsl:value-of select="emplid" /></td>
<td><xsl:value-of select="emplname" /></td>
<td style="text-align:right;"><xsl:value-of select="emplsalary" /></td>
</tr>
</xsl:for-each>
</table>	
</xsl:template>  
</xsl:stylesheet>

