import { useEffect, useState } from "react";
import { promiseGetRecoil } from "recoil-outside";
import { RecoilValue, RecoilState } from "recoil";

interface Options {
  transform?: (value: any) => any | void;
  fallbackValue?: any;
}

export default function usePromisedRecoilValue(
  recoilState: RecoilState<any>,
  options: Options
) {
  const [state, setState] = useState(options?.fallbackValue);

  useEffect(() => {
    (async () => {
      const value = await promiseGetRecoil(recoilState);

      setState(options?.transform?.(value) || value);
    })();
  }, []);

  return state;
}
