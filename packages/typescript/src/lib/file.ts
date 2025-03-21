import * as path from 'node:path';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import fg from 'fast-glob';
import { getProject } from '@/get-project';
import { generateMDX, type GenerateMDXOptions } from './mdx';

export interface GenerateFilesOptions {
  input: string | string[];
  /**
   * Output directory, or a function that returns the output path
   */
  output: string | ((inputPath: string) => string);
  globOptions?: fg.Options;
  options?: GenerateMDXOptions;

  /**
   * @returns New content
   */
  transformOutput?: (path: string, content: string) => string;
}

export async function generateFiles(
  options: GenerateFilesOptions,
): Promise<void> {
  const files = await fg(options.input, options.globOptions);
  const project =
    options.options?.project ?? getProject(options.options?.config);

  const produce = files.map(async (file) => {
    const absolutePath = path.resolve(file);
    const outputPath =
      typeof options.output === 'function'
        ? options.output(file)
        : path.resolve(
            options.output,
            `${path.basename(file, path.extname(file))}.mdx`,
          );

    const content = (await readFile(absolutePath)).toString();
    let result = generateMDX(content, {
      basePath: path.dirname(absolutePath),
      ...options.options,
      project,
    });

    if (options.transformOutput) {
      result = options.transformOutput(outputPath, result);
    }

    await write(outputPath, result);
    console.log(`Generated: ${outputPath}`);
  });

  await Promise.all(produce);
}

async function write(file: string, content: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}
