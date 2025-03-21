import * as path from 'node:path';
import fs from 'node:fs';
import { getProject } from '@/get-project';
import {
  type DocEntry,
  type GeneratedDoc,
  generateDocumentation,
  type GenerateDocumentationOptions,
} from './base';

interface Templates {
  block: (doc: GeneratedDoc, children: string) => string;
  property: (entry: DocEntry) => string;
}

export interface GenerateMDXOptions extends GenerateDocumentationOptions {
  /**
   * a root directory to resolve relative file paths
   */
  basePath?: string;
  templates?: Partial<Templates>;
}

// \r?\n is required for cross-platform compatibility
const regex =
  /^---type-table---\r?\n(?<file>.+?)(?:#(?<name>.+))?\r?\n---end---$/gm;

const defaultTemplates: Templates = {
  block: (doc, c) => `### ${doc.name}

${doc.description}

<div className='*:border-b [&>*:last-child]:border-b-0'>${c}</div>`,

  property: (c) => `<div className='text-sm text-fd-muted-foreground py-4'>

<div className="flex flex-row items-center gap-4">
  <code className="text-sm">${c.name}</code>
  <code className="text-fd-muted-foreground">{${JSON.stringify(c.type)}}</code>
</div>

${c.description || 'No Description'}

${Object.entries(c.tags)
  .map(([tag, value]) => `- ${tag}:\n${replaceJsDocLinks(value)}`)
  .join('\n')}

</div>`,
};

export function generateMDX(
  source: string,
  { basePath = './', templates: overrides, ...rest }: GenerateMDXOptions = {},
): string {
  const templates = { ...defaultTemplates, ...overrides };
  const project = rest.project ?? getProject(rest.config);

  return source.replace(regex, (...args) => {
    const groups = args[args.length - 1] as {
      file: string;
      name: string | undefined;
    };
    const file = path.resolve(basePath, groups.file);
    const content = fs.readFileSync(file);
    const docs = generateDocumentation(file, groups.name, content.toString(), {
      ...rest,
      project,
    });

    return docs
      .map((doc) =>
        templates.block(doc, doc.entries.map(templates.property).join('\n')),
      )
      .join('\n\n');
  });
}

function replaceJsDocLinks(md: string): string {
  return md.replace(/{@link (?<link>[^}]*)}/g, '$1');
}
