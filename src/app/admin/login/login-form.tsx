"use client";

import { login } from "../actions";
import { FormMessage, SubmitButton, useFormAction } from "@/components/admin/form-bits";

export function LoginForm({ next }: { next: string }) {
  const { state, onSubmit, pending } = useFormAction(login);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="username" className="label">
          Username
        </label>
        <input id="username" name="username" autoComplete="username" required className="input" autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <FormMessage state={state} />
      <SubmitButton busy={pending} pendingLabel="Signing in…" className="btn-primary w-full py-3">
        Sign in
      </SubmitButton>
    </form>
  );
}
