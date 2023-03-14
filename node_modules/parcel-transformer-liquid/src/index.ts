import { Transformer } from '@parcel/plugin';
import { Liquid, defaultOptions } from 'liquidjs';
import fs from 'fs';
import path from 'path';

type LiquidOptions = Partial<typeof defaultOptions>;

export default new Transformer({
  async loadConfig({ config }) {
    const configFiles = [
      '.liquidrc',
      '.liquidrc.js',
      '.liquidrc.cjs',
      'liquid.config.js',
      'liquid.config.cjs',
    ];

    const { contents, filePath } =
      (await config.getConfig<LiquidOptions>(configFiles)) || {};

    if (filePath) {
      if (filePath.endsWith('.js')) {
        config.invalidateOnStartup();
      }

      config.invalidateOnFileChange(filePath);
    }

    return contents;
  },
  async transform({ asset, config, options }) {
    const conf: LiquidOptions = config;
    const engine = new Liquid(conf);
    const code = await asset.getCode();
    const template = await engine.parseAndRender(code);

    if (conf.root?.length > 0) {
      let deps: string[] = [];

      for (const dir of conf.root) {
        const files = fs
          .readdirSync(dir)
          .map(filePath => path.join(dir, filePath));

        deps = deps.concat(files);
      }

      for (const dep of deps) {
        await asset.invalidateOnFileChange(
          path.resolve(options.projectRoot, dep),
        );
      }
    }

    asset.setCode(template);
    asset.type = 'html';

    return [asset];
  },
});
