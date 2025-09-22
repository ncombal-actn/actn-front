const fs = require('fs');
const path = require('path');


const [
  indexFile,
  serverBundlePath,
  browserOutputPath,
  ...routes
] = process.argv.slice(2);

/**
 * Handles importing the server bundle.
 */
async function getServerBundle(bundlePath: string) {
  const {
    AppServerModule,
    AppServerModuleNgFactory,
    renderModule,
    renderModuleFactory,
  } = await import(bundlePath);

  if (renderModuleFactory && AppServerModuleNgFactory) {
    // Happens when in ViewEngine mode.
    return {
      renderModuleFn: renderModuleFactory,
      AppServerModuleDef: AppServerModuleNgFactory,
    };
  }

  if (renderModule && AppServerModule) {
    // Happens when in Ivy mode.
    return {
      renderModuleFn: renderModule,
      AppServerModuleDef: AppServerModule,
    };
  }
  throw new Error(`renderModule method and/or AppServerModule were not exported from: ${serverBundlePath}.`);
}

/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
(async () => {
  const { renderModuleFn, AppServerModuleDef } = await getServerBundle(serverBundlePath);
  const browserIndexOutputPath = path.join(browserOutputPath, indexFile);
  const indexHtml = fs.readFileSync(browserIndexOutputPath, 'utf8');
  for (const route of routes) {
    const renderOpts = {
      document: indexHtml + '<!-- This page was prerendered with Angular Universal -->',
      url: route,
    };
    const html = await renderModuleFn(AppServerModuleDef, renderOpts);

    const outputFolderPath = path.join(browserOutputPath, route);
    const outputIndexPath = path.join(outputFolderPath, 'index.html');

    // This case happens when we are prerendering "/".
    if (browserIndexOutputPath === outputIndexPath) {
      const browserIndexOutputPathOriginal = path.join(browserOutputPath, 'index.original.html');
      fs.writeFileSync(browserIndexOutputPathOriginal, indexHtml);
    }

    try {
      fs.mkdirSync(outputFolderPath, { recursive: true });
      fs.writeFileSync(outputIndexPath, html);
      const bytes = Buffer.byteLength(html).toFixed(0);
      if (process.send) {
        process.send({ success: true, outputIndexPath, bytes });
      }
    } catch (e) {
      if (process.send) {
        process.send({ success: false, error: e.message, outputIndexPath });
      }
    }
  }
})().then().catch();