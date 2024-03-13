import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeProvider } from "@/components/ui/theme-provider";

interface Pergunta {
  id: number;
  pergunta: string;
  descricao: string;
  tipoPergunta: string;
  evidencia: boolean;
  anomalia: boolean;
}

function App() {
  const [pergunta, setPergunta] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [tipoPergunta, setTipoPergunta] = useState<string>("");
  const [evidencia, setEvidencia] = useState<boolean>(false);
  const [anomalia, setAnomalia] = useState<boolean>(false);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [perguntaEditando, setPerguntaEditando] = useState<number | null>(null);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState<number | null>(
    null
  );
  const [exibirQuadrado, setExibirQuadrado] = useState<boolean>(false);

  useEffect(() => {
    if (perguntaEditando !== null) {
      const perguntaSelecionada = perguntas.find(
        (pergunta) => pergunta.id === perguntaEditando
      );
      if (perguntaSelecionada) {
        setPergunta(perguntaSelecionada.pergunta);
        setDescricao(perguntaSelecionada.descricao);
        setTipoPergunta(perguntaSelecionada.tipoPergunta);
        setEvidencia(perguntaSelecionada.evidencia);
        setAnomalia(perguntaSelecionada.anomalia);
      }
    }
  }, [perguntaEditando, perguntas]);

  const adicionarPergunta = () => {
    const novaPergunta: Pergunta = {
      id: nextId,
      pergunta,
      descricao,
      tipoPergunta,
      evidencia,
      anomalia,
    };

    setPerguntas([...perguntas, novaPergunta]);
    setNextId(nextId + 1);
    limparCampos();
  };

  const limparCampos = () => {
    setPergunta("");
    setDescricao("");
    setTipoPergunta("");
    setEvidencia(false);
    setAnomalia(false);
    setPerguntaEditando(null);
    setPerguntaSelecionada(null);
    setExibirQuadrado(false);
  };

  const excluirPergunta = (id: number) => {
    const perguntasAtualizadas = perguntas.filter(
      (pergunta) => pergunta.id !== id
    );
    setPerguntas(perguntasAtualizadas);
    if (perguntaEditando === id) {
      limparCampos();
    }
  };

  const selecionarPergunta = (id: number) => {
    setPerguntaSelecionada(id);
    const perguntaSelecionada = perguntas.find(
      (pergunta) => pergunta.id === id
    );
    if (perguntaSelecionada?.tipoPergunta === "Confirmativo") {
      setExibirQuadrado(true);
    } else {
      setExibirQuadrado(false);
    }
    // Exibir pergunta e descrição quando uma pergunta for selecionada
    if (perguntaSelecionada) {
      setPergunta(perguntaSelecionada.pergunta);
      setDescricao(perguntaSelecionada.descricao);
    }
  };

  const moverPerguntaParaCima = (id: number) => {
    const index = perguntas.findIndex((pergunta) => pergunta.id === id);
    if (index > 0) {
      const perguntasAtualizadas = [...perguntas];
      [perguntasAtualizadas[index - 1], perguntasAtualizadas[index]] = [
        perguntasAtualizadas[index],
        perguntasAtualizadas[index - 1],
      ];
      setPerguntas(perguntasAtualizadas);
    }
  };

  const moverPerguntaParaBaixo = (id: number) => {
    const index = perguntas.findIndex((pergunta) => pergunta.id === id);
    if (index < perguntas.length - 1) {
      const perguntasAtualizadas = [...perguntas];
      [perguntasAtualizadas[index], perguntasAtualizadas[index + 1]] = [
        perguntasAtualizadas[index + 1],
        perguntasAtualizadas[index],
      ];
      setPerguntas(perguntasAtualizadas);
    }
  };

  const editarPergunta = (id: number) => {
    setPerguntaEditando(id);
    setPerguntaSelecionada(id);
  };

  const salvarPerguntaEditada = () => {
    const perguntasAtualizadas = perguntas.map((item) =>
      item.id === perguntaEditando
        ? {
            ...item,
            pergunta,
            descricao,
            tipoPergunta,
            evidencia,
            anomalia,
          }
        : item
    );
    setPerguntas(perguntasAtualizadas);
    limparCampos();
  };

  const gerarArquivo = () => {
    const jsonData = perguntas
      .map((pergunta) => JSON.stringify(pergunta))
      .join("\n");
    const blob = new Blob([jsonData], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "perguntas.json");
  };

  const importarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedQuestions: Pergunta[] = (e.target?.result as string)
            .split("\n")
            .map((line) => JSON.parse(line));
          setPerguntas(importedQuestions);
        } catch (error) {
          console.error("Erro ao importar arquivo:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen p-8 flex justify-between relative flex-wrap">
        <div className="mt-8 flex gap-4  flex-col">
          <Input
            placeholder="Digite sua pergunta"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
          />
          <Input
            placeholder="Descreva a pergunta"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <select
            className="bg-background border border-white rounded-md p-2"
            value={tipoPergunta}
            onChange={(e) => setTipoPergunta(e.target.value)}
          >
            <option value="Null">Null</option>
            <option value="Quantitativo">Quantitativo</option>
            <option value="Logico">Lógico</option>
            <option value="Confirmativo">Confirmativo</option>
            <option value="Múltipla Escolha">Múltipla Escolha</option>
            <option value="Option Five">Option Five</option>
          </select>

          <div className="flex gap-4">
            <div>
              <input
                type="checkbox"
                id="evidencia"
                checked={evidencia}
                onChange={(e) => setEvidencia(e.target.checked)}
              />
              <label htmlFor="evidencia">Evidência</label>
            </div>

            <div>
              <input
                type="checkbox"
                id="anomalia"
                checked={anomalia}
                onChange={(e) => setAnomalia(e.target.checked)}
              />
              <label htmlFor="anomalia">Anomalia</label>
            </div>
          </div>

          {perguntaEditando === null ? (
            <Button onClick={adicionarPergunta}>Inserir Pergunta</Button>
          ) : (
            <Button onClick={salvarPerguntaEditada}>Salvar Edição</Button>
          )}
          <Button onClick={gerarArquivo}>Gerar Arquivo</Button>
          <input type="file" accept=".json" onChange={importarArquivo} />
        </div>

        <div className="h-[25rem] w-[40rem] bg-foreground rounded-xl flex flex-col items-center  gap-52 flex-wrap ">
          {perguntaSelecionada !== null && (
            <div className="flex flex-col items-center">
              <p className="text-background mt-8 text-3xl">{pergunta}</p>
              <p className="text-background mt-4 text-xl">{descricao}</p>
            </div>
          )}

          {exibirQuadrado && (
            <div className="w-32 h-12 rounded-xl bg-red-500 flex justify-center items-center font-bold">
              CONCLUIDO
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {perguntas.map((pergunta) => (
            <div
              key={pergunta.id}
              className={`border rounded-xl p-4 cursor-pointer ${
                pergunta.id === perguntaSelecionada ? "border-foreground" : ""
              }`}
              onClick={() => selecionarPergunta(pergunta.id)}
            >
              <div>ID: {pergunta.id}</div>
              <div>Pergunta: {pergunta.pergunta}</div>
              <div>Descrição: {pergunta.descricao}</div>
              <div>Tipo de Pergunta: {pergunta.tipoPergunta}</div>
              <div>Evidência: {pergunta.evidencia ? "Sim" : "Não"}</div>
              <div>Anomalia: {pergunta.anomalia ? "Sim" : "Não"}</div>
              {pergunta.id === perguntaSelecionada && (
                <div className="flex gap-2">
                  <Button onClick={() => excluirPergunta(pergunta.id)}>
                    Excluir
                  </Button>
                  <Button onClick={() => editarPergunta(pergunta.id)}>
                    Editar
                  </Button>
                  <Button onClick={() => moverPerguntaParaCima(pergunta.id)}>
                    Subir
                  </Button>
                  <Button onClick={() => moverPerguntaParaBaixo(pergunta.id)}>
                    Descer
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
