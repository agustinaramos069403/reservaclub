import { describe, expect, it } from "vitest";
import { FixedReloj } from "../src/components/Reloj.js";
import { FakeCorreo } from "../src/components/Correo.js";
import type { Correo } from "../src/components/Correo.js";
import type { Reloj } from "../src/components/Reloj.js";

describe("Reloj and Correo injection", () => {
  it("accepts a FixedReloj and returns the fixed instant", () => {
    const fixedInstant = new Date("2026-10-21T15:00:00-03:00");
    const reloj: Reloj = new FixedReloj(fixedInstant);

    expect(reloj.now().getTime()).toBe(fixedInstant.getTime());
  });

  it("accepts a fake Correo and send does not call a real email server", () => {
    const reloj: Reloj = new FixedReloj(new Date("2026-10-21T15:00:00-03:00"));
    const correo: Correo = new FakeCorreo();

    expect(() => {
      correo.send("reserva confirmada", "socio@club.test", reloj.now());
    }).not.toThrow();
  });
});
