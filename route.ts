import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM: Record<string, string> = {
  roast: `Tu es un sneakerhead français cash, drôle, légèrement insolent mais bienveillant. On te donne l'inventaire d'un reseller (sneakers + streetwear).
Tu fais un roast en français, 4 à 6 phrases, sans liste, ton direct.
Tu peux te moquer GENTIMENT des choix faibles, féliciter les meilleurs flips, et terminer par UNE phrase de conseil concret.
Vocabulaire reseller (cop, hold, flip, dust, GR, holy grail). Maximum 2 emojis. Tutoie le reseller.`,
  caption: `Tu es un créateur de contenu sneakers/streetwear sur TikTok francophone.
On te donne UNE pièce. Génère 3 captions TikTok en français, 3 tons différents :
1. Hype / flex (court et percutant)
2. Storytelling (l'histoire derrière le cop)
3. Question qui engage la communauté
Chaque caption max 22 mots. Termine chaque caption par 4-6 hashtags pertinents.
Format strict :
1. [caption]
[hashtags]

2. [caption]
[hashtags]

3. [caption]
[hashtags]`,
  flip: `Tu es un consultant reseller chevronné du marché français. On te donne un inventaire.
Identifie LA pièce à flipper en priorité MAINTENANT et UNE pièce à hold absolument.
Réponds en 5 phrases max, en français, ton direct, vocabulaire reseller.
Cite le nom exact de chaque pièce et justifie brièvement (saturation marché, hype, saisonnalité, marge réalisée déjà bonne, etc.).
Termine par une phrase punchline.`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = String(body?.type || "");
    const userContent = String(body?.userContent || "").slice(0, 8000);
    if (!SYSTEM[type] || !userContent) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ANTHROPIC_API_KEY manquante. Ajoute-la dans Vercel > Project > Settings > Environment Variables, puis redéploie.",
        },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        system: SYSTEM[type],
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Anthropic API ${res.status} — ${errText.slice(0, 250)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = (data?.content ?? [])
      .map((b: { type?: string; text?: string }) => (b?.type === "text" ? b.text || "" : ""))
      .join("\n")
      .trim();

    return NextResponse.json({ text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
