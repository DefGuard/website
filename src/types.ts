export type ImportGlob<T> = Array<{
  frontmatter: T;
  rawContent: () => string;
}>;
