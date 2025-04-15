import { z } from 'zod';

type Diff<A, B> = {
  [K in keyof A]: K extends keyof B
    ? [A[K]] extends [B[K]]
      ? [B[K]] extends [A[K]]
        ? never
        : K
      : K
    : K
}[keyof A]

type MissingInA<A, B> = Exclude<keyof B, keyof A>
type MissingInB<A, B> = Exclude<keyof A, keyof B>

type TypeDifference<A, B> = Diff<A, B> | MissingInA<A, B> | MissingInB<A, B>

type AssertExact<A, B> =
  TypeDifference<A, B> extends never
    ? true
    : {
        ERROR: 'Types are not equal'
        DIFF_KEYS: TypeDifference<A, B>
      }

const zoo = z.object({
  animals: z.array(z.string()),
  staff: z.array(z.string()).optional(),
});

type ZooFromZod = z.infer<typeof zoo>;

interface Zoo {
  animals: string[];
  staff: string[]; // Should be optional
}

type Check = AssertExact<ZooFromZod, Zoo>;
