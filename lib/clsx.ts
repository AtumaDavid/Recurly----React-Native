type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];

export default function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const append = (value: ClassValue) => {
    if (!value) {
      return;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(append);
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, enabled]) => {
        if (enabled) {
          classes.push(key);
        }
      });
    }
  };

  inputs.forEach(append);

  return classes.join(' ');
}
