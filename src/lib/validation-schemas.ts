import { z } from "zod";

export const claimBarSchema = z.object({
  ownerName: z
    .string()
    .trim()
    .min(2, "Informe seu nome")
    .max(100, "Máx. 100 caracteres"),
  document: z
    .string()
    .trim()
    .min(11, "CPF/CNPJ inválido")
    .max(18, "CPF/CNPJ inválido")
    .regex(/^[\d./-]+$/, "Use apenas números e separadores"),
  phone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20, "Telefone inválido")
    .regex(/^[\d()\s+-]+$/, "Telefone inválido"),
  plan: z.enum(["basic", "premium", "destaque"]),
});
export type ClaimBarInput = z.infer<typeof claimBarSchema>;

export const suggestVenueSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome").max(100),
  neighborhood: z.string().trim().min(2, "Informe o bairro").max(80),
  competitions: z
    .array(z.string().max(40))
    .min(1, "Selecione ao menos uma competição")
    .max(8),
});
export type SuggestVenueInput = z.infer<typeof suggestVenueSchema>;
