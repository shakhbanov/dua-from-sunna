<?xml version="1.0" encoding="UTF-8"?>
<!--
  Human-readable rendering of sitemap.xml.

  Purely presentational: crawlers read the underlying <urlset> and ignore this
  stylesheet entirely. Google documents xml-stylesheet on sitemaps as supported.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="ru">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Карта сайта — Дуа</title>
        <style>
          :root { color-scheme: light dark; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                 margin: 0; padding: 2.5rem 1.25rem 4rem; color: #09090b; background: #fff;
                 line-height: 1.5; }
          .wrap { max-width: 68rem; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin: 0 0 2rem; }
          table { border-collapse: collapse; width: 100%; font-size: .875rem; }
          th { text-align: left; font-weight: 600; color: #71717a; font-size: .75rem;
               text-transform: uppercase; letter-spacing: .04em; padding: 0 .75rem .6rem 0;
               border-bottom: 1px solid #e4e4e7; white-space: nowrap; }
          td { padding: .55rem .75rem .55rem 0; border-bottom: 1px solid #f4f4f5;
               vertical-align: top; }
          td.num { color: #a1a1aa; font-variant-numeric: tabular-nums; width: 3.5rem; }
          a { color: #09090b; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .path { word-break: break-all; }
          .meta { color: #71717a; font-variant-numeric: tabular-nums; white-space: nowrap; }
          .alt { color: #a1a1aa; font-size: .8rem; }
          @media (prefers-color-scheme: dark) {
            body { background: #09090b; color: #fafafa; }
            th, .meta { color: #a1a1aa; }
            th { border-bottom-color: #27272a; }
            td { border-bottom-color: #18181b; }
            a { color: #fafafa; }
            td.num, .alt { color: #52525b; }
          }
          @media (max-width: 640px) { .hide-sm { display: none; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Карта сайта</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Адрес</th>
                <th class="hide-sm">Изменён</th>
                <th class="hide-sm">Приоритет</th>
                <th class="hide-sm">Языки</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="num"><xsl:value-of select="position()"/></td>
                  <td class="path">
                    <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td class="meta hide-sm"><xsl:value-of select="s:lastmod"/></td>
                  <td class="meta hide-sm"><xsl:value-of select="s:priority"/></td>
                  <td class="alt hide-sm">
                    <xsl:for-each select="xhtml:link">
                      <xsl:value-of select="@hreflang"/>
                      <xsl:if test="position() != last()"> · </xsl:if>
                    </xsl:for-each>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
