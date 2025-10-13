import { type BuildStats, isVirtual } from '@/entities/bundle-stats';

export interface ModuleTreeNode {
  title: string;
  query?: string;
  children?: ModuleTreeNode[];
  fileName?: string;
  collapsed?: boolean;
  visible: boolean;
  icons?: string[];
  size?: number;
}

export type ModuleTree = Array<ModuleTreeNode>;

function parseName(file: string): [name: string, query?: string] {
  const [fileName, query] = file.substring(file.lastIndexOf('/')).split('?');

  if (query) {
    return [fileName, query];
  } else {
    return [fileName];
  }
}

// @unocss-include
const EXTENSIONS: Record<string, string> = {
  // JavaScript
  js: 'i-vscode-icons:file-type-js-official',
  mjs: 'i-vscode-icons:file-type-js-official',
  cjs: 'i-vscode-icons:file-type-js-official',
  // TypeScript
  ts: 'i-vscode-icons:file-type-typescript-official',
  mts: 'i-vscode-icons:file-type-typescript-official',
  cts: 'i-vscode-icons:file-type-typescript-official',
  // Frameworks
  vue: 'i-vscode-icons:file-type-vue',
  jsx: 'i-vscode-icons:file-type-reactjs',
  tsx: 'i-vscode-icons:file-type-reactts',
  // Styling
  css: 'i-vscode-icons:file-type-css',
  scss: 'i-vscode-icons:file-type-sass',
  sass: 'i-vscode-icons:file-type-sass',
  less: 'i-vscode-icons:file-type-less',
  // Assets
  svg: 'i-vscode-icons:file-type-svg',
  html: 'i-vscode-icons:file-type-html',
};

function getModuleIcons(node: ModuleTreeNode, stats: BuildStats) {
  const result: string[] = [];
  const fileName = node.fileName;
  if (!fileName) {
    return result;
  }

  if (isVirtual(fileName, stats)) {
    result.push('i-vscode-icons:file-type-vite');
    return result;
  }

  const [name, query] = parseName(fileName);

  // primary icon
  const ext = name.substring(name.lastIndexOf('.') + 1);
  const extensionIcon = EXTENSIONS[ext];
  if (extensionIcon) {
    result.push(extensionIcon);
  }

  // additional icons
  if (typeof query === 'string' && query?.startsWith('vue')) {
    const lang = /lang\.([a-z]+)/gm.exec(query)?.[1];
    const additionalIcon = EXTENSIONS[lang ?? ''];
    if (additionalIcon) {
      result.push(additionalIcon);
    }
  }

  return result;
}

export function getModuleTree(moduleNames: string[], stats: BuildStats) {
  const tree: ModuleTree = [];

  for (const name of moduleNames) {
    const parts = name.split('/');

    let branch = tree;
    for (let index = 0; index < parts.length; index++) {
      const item = branch.find((i) => i.title === parts[index]);
      if (!item) {
        const newNode: ModuleTreeNode = {
          title: parts[index],
          visible: true,
        };
        if (index !== parts.length - 1) {
          newNode.children = [];
          newNode.collapsed = true;
          newNode.icons = ['i-vscode-icons:default-folder'];
        } else {
          const queryIndex = parts[index].indexOf('?');
          if (queryIndex !== -1) {
            newNode.query = parts[index].substring(queryIndex + 1);
          }

          newNode.title = newNode.title.substring(0, queryIndex !== -1 ? queryIndex : undefined);
          newNode.fileName = name;
          newNode.icons = getModuleIcons(newNode, stats);
        }

        branch.push(newNode);
        branch = newNode.children!;
      } else {
        branch = item.children!;
      }
    }
  }

  return tree;
}
