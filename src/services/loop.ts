import { LoopCallback } from "@/types";

let _next = 0;
let _raf: number | null = null;
const _callbacks = new Map<number, LoopCallback>();

const _begin = () => {
   if (_raf) return;
   _loop();
}

const _stop = () => {
   if (!_raf) return;
   cancelAnimationFrame(_raf);
   _raf = null;
}

const _loop = (last = performance.now()) => {
   const now = performance.now();
   const dt = now - last;
   for (const [,callback] of _callbacks) callback(dt);
   _raf = requestAnimationFrame(() => _loop(now));
}

const add = (callback: LoopCallback): number => {
   const id = _next++;

   _callbacks.set(id, callback);

   _begin();

   return id;
}

const remove = (id: number) => {
   _callbacks.delete(id)
   if (_callbacks.size <= 0) _stop();
}

const useLoop = () => ({ add, remove });

export default useLoop;