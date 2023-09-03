import * as AI from "ai-jsx";
import {
  ChatCompletion,
  SystemMessage,
  UserMessage,
} from "ai-jsx/core/completion";
import path from "path";
import fs from "fs";
import terminal from "terminal-kit";
const { terminal: term } = terminal;

function App() {
  const glyphs: Map<string, string> = new Map();
  const allGlyphs = fs.readdirSync("./glyphs");
  for (const glyph of allGlyphs) {
    if (!glyph.endsWith(".svg")) continue;
    term("Reading ").green(glyph).green("...\n");
    glyphs.set(glyph, fs.readFileSync(path.join("./glyphs", glyph), "utf-8"));
  }
  const glyphPrompt: string[] = [];
  glyphs.forEach((glyph, word) =>
    glyphPrompt.push(`The glyph for the phoneme "${word.split(".")[0]}" is: ${glyph}{'\n'}`)
  );

  return (
    <ChatCompletion>
      <SystemMessage>
        You are an AI assistant that generates glyphs for a constructed
        language. In this language, each glyph represents a single phoneme. The
        writing system of this language is an abugida, where each glyph
        represents a consonant with an optional vowel. The vowel can be
        represented by a diacritic, or by a separate glyph.{"\n"}
        You will be given examples of phonemes in the langugae, along with
        glyphs in SVG format. Your job is to generate new glyphs for new
        phonemese.{"\n"}
      </SystemMessage>
      <UserMessage>
        You are generating glyphs for a constructed language called Derpytext.
        The glyphs are represented in SVG format.{"\n"}
        {glyphPrompt.join("\n")}
        {"\n"}Please generate a glyph for the phoneme "gw".{"\n"}
      </UserMessage>
    </ChatCompletion>
  );
}

const renderContext = AI.createRenderContext();
const response = await renderContext.render(<App />);
console.log(response);
