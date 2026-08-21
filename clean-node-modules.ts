import {promises as fs} from 'node:fs';
import path from 'node:path';

const TARGET_DIR_NAME = 'node_modules';

/**
 * 递归遍历目录，删除所有 node_modules 文件夹
 */
async function removeNodeModulesRecursive(dir: string): Promise<void> {
  let entries: any[];

  try {
    entries = await fs.readdir(dir, {withFileTypes: true});
  } catch (err) {
    // 没权限或目录被删了，直接跳过
    return;
  }

  await Promise.all(
    entries.map(async entry => {
      if (!entry.isDirectory()) return;

      const fullPath = path.join(dir, entry.name);

      if (entry.name === TARGET_DIR_NAME) {
        try {
          console.log(`🧹 Removing: ${fullPath}`);
          // Node 14+ 支持 recursive + force
          await fs.rm(fullPath, {recursive: true, force: true});
        } catch (err) {
          console.error(`❌ Failed to remove ${fullPath}`, err);
        }
        return;
      }

      // 不是 node_modules，继续向下递归
      await removeNodeModulesRecursive(fullPath);
    }),
  );
}

async function main() {
  const root = process.argv[2] ?? process.cwd();
  console.log(`Starting cleanup from: ${root}`);
  await removeNodeModulesRecursive(root);
  console.log('✅ Done');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
