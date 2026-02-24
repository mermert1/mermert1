import { describe, expect, it } from 'vitest';
import { serializeState, deserializeState, type SerdeType } from './serde';
import { defaultState } from './state';
import type { State } from '$lib/types';

const verifySerde = (state: State, serde?: SerdeType): string => {
  const serialized = serializeState(state, serde);
  const deserialized = deserializeState(serialized);
  expect(deserialized).to.deep.equal(state);
  return serialized;
};

describe('Serde tests', () => {
  it('should serialize and deserialize with default serde', () => {
    expect(verifySerde(defaultState)).toMatchInlineSnapshot(
      `"pako:eNpNkEFOwzAQRa8ymhVIzQW8QKIJdFMEi66Iuxglk9hq7LEchwiluTsOFRW7-V_vzeIv2EjLqLAbZG4MxQSnSvvnujTRjsnReIaieLrCgRM48fwNV9g_HARGIyFY3z9qv98QKJfjxjAkY_0FVu3Lm_ruOUtVfaSQJJzv_WmW3L_U9sPkx_96E3kzXuuOFHQEBTQUoaSYGdxhH22LKsWJd-g4OtoiLtoDaEyGHWtU-Wy5o2lIGrVfsxbIf4q4PzPK1BtUHQ1jTlNoKXFlqY90R74sz2-3eX5XWn8Am4ljrA"`
    );
  });

  it('should serialize and deserialize with base64 serde', () => {
    expect(verifySerde(defaultState, 'base64')).toMatchInlineSnapshot(
      `"base64:eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5BW0NocmlzdG1hc10gLS0-fCBHZXQgbW9uZXkgfCBCKEdvIHNob3BwaW5nKVxuQiAtLT4gQ3tMZXQgbWUgdGhpbmsgfVxuQyAtLT58IE9uZSB8IERbTGFwdG9wXVxuQyAtLT58IFR3byB8IEVbaVBob25lXVxuQyAtLT58IFRocmVlIHwgRltmYTogZmEgLSBjYXIgQ2FyXVxuIiwiZ3JpZCI6dHJ1ZSwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInBhblpvb20iOnRydWUsInJvdWdoIjpmYWxzZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZSwidmlld01vZGUiOiJjb2RlIn0"`
    );
  });

  it('should serialize and deserialize with pako serde', () => {
    expect(verifySerde(defaultState, 'pako')).toMatchInlineSnapshot(
      `"pako:eNpNkEFOwzAQRa8ymhVIzQW8QKIJdFMEi66Iuxglk9hq7LEchwiluTsOFRW7-V_vzeIv2EjLqLAbZG4MxQSnSvvnujTRjsnReIaieLrCgRM48fwNV9g_HARGIyFY3z9qv98QKJfjxjAkY_0FVu3Lm_ruOUtVfaSQJJzv_WmW3L_U9sPkx_96E3kzXuuOFHQEBTQUoaSYGdxhH22LKsWJd-g4OtoiLtoDaEyGHWtU-Wy5o2lIGrVfsxbIf4q4PzPK1BtUHQ1jTlNoKXFlqY90R74sz2-3eX5XWn8Am4ljrA"`
    );
  });

  it('should throw error for unrecognized serde', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => serializeState(defaultState, 'unknown')).toThrowError(
      'Unknown serde type: unknown'
    );
    expect(() => deserializeState('unknown:hello')).toThrowError('Unknown serde type: unknown');
  });
});
