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
    term("Reading ").green(glyph).green("...\n");
    glyphs.set(glyph, fs.readFileSync(path.join("./glyphs", glyph), "utf-8"));
  }
  const glyphPrompt: string[] = [];
  glyphs.forEach((glyph, word) => glyphPrompt.push(`The glyph for "${word.split(".")[0]}" is: ${glyph}{'\n'}`));

  return (
    <ChatCompletion>
      <SystemMessage>
        You are an AI assistant that generates glyphs for a constructed
        language. You will be given examples of words in the langugae, along
        with glyphs in SVG format. Your job is to generate new glyphs for new
        words.
      </SystemMessage>
      <UserMessage>
        You are generating glyphs for a constructed language called Derpytext.
        The glyphs are represented in SVG format.{"\n"}
        {glyphPrompt.join("\n")}
        Please generate a glyph for the word "broom".
      </UserMessage>
    </ChatCompletion>
  );
}

const renderContext = AI.createRenderContext();
const response = await renderContext.render(<App />);
console.log(response);
