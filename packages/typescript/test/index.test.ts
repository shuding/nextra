import { expect, test } from 'vitest';
import { generateDocumentation } from '@/lib/base';

test('class members', () => {
  const out = generateDocumentation(
    'index.ts',
    'MyClass',
    `
    export class MyClass {
        #name: string;
        private test: string;
        age: number;
        
        constructor(name: string) { 
            this.#name = name;
        }
    }
    `,
  );

  expect(out).toMatchInlineSnapshot(`
    [
      {
        "description": "",
        "entries": [
          {
            "description": "",
            "name": "test",
            "required": true,
            "tags": {},
            "type": "string",
          },
          {
            "description": "",
            "name": "age",
            "required": true,
            "tags": {},
            "type": "number",
          },
        ],
        "name": "MyClass",
      },
    ]
  `);
});

test('interface members', () => {
  const out = generateDocumentation(
    'index.ts',
    'MyInterface',
    `
    export interface MyInterface {
        "#name": string;
        age: number
    }
    `,
  );

  expect(out).toMatchInlineSnapshot(`
    [
      {
        "description": "",
        "entries": [
          {
            "description": "",
            "name": "#name",
            "required": true,
            "tags": {},
            "type": "string",
          },
          {
            "description": "",
            "name": "age",
            "required": true,
            "tags": {},
            "type": "number",
          },
        ],
        "name": "MyInterface",
      },
    ]
  `);
});
