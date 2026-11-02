import { useRef, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import { alunos, paraNumero, formata, valida, agora } from './dados.js'
import { Botao, Etiqueta, Aviso, Modal, SeletorAvaliacao, base } from '../../../src/componentes.jsx'

// Tela #201: lançar notas dos alunos (envio e rascunho)
export default function LancarNotasScreen({ lancamentos, setLancamentos, avaliacaoInicial }) {
  const [avaliacao, setAvaliacao] = useState(avaliacaoInicial)
  const [notas, setNotas] = useState(lancamentos[avaliacaoInicial]?.notas || {})
  const [erros, setErros] = useState({})
  const [aviso, setAviso] = useState('')
  const [semNota, setSemNota] = useState(0) // maior que 0 abre o modal
  const campos = useRef({})

  const lancamento = lancamentos[avaliacao]
  const enviado = lancamento?.status === 'Enviado'

  // Ao escolher a avaliação, carrega as notas (rascunho, se existir)
  function escolherAvaliacao(nome) {
    setAvaliacao(nome)
    setNotas(lancamentos[nome]?.notas || {})
    setErros({})
    setAviso('')
  }

  function validarCampo(matricula) {
    setErros({ ...erros, [matricula]: !valida(notas[matricula] || '') })
  }

  // Valida todos os campos e leva o cursor ao primeiro erro
  function validarTodos() {
    const novos = {}
    alunos.forEach((a) => { novos[a.matricula] = !valida(notas[a.matricula] || '') })
    setErros(novos)
    const primeiro = alunos.find((a) => novos[a.matricula])
    if (primeiro) campos.current[primeiro.matricula]?.focus()
    return !primeiro
  }

  function limpar() {
    const limpas = {}
    alunos.forEach((a) => {
      const texto = (notas[a.matricula] || '').trim()
      if (texto) limpas[a.matricula] = formata(paraNumero(texto))
    })
    return limpas
  }

  function salvarRascunho() {
    if (!validarTodos()) return
    const limpas = limpar()
    setNotas(limpas)
    setLancamentos({ ...lancamentos, [avaliacao]: { status: 'Rascunho', salvoEm: agora(), notas: limpas } })
    setAviso('Rascunho salvo com sucesso')
  }

  function enviar() {
    const limpas = limpar()
    setNotas(limpas)
    setLancamentos({ ...lancamentos, [avaliacao]: { status: 'Enviado', notas: limpas } })
    setSemNota(0)
    setAviso('Notas enviadas com sucesso')
  }

  function clicarEnviar() {
    if (!validarTodos()) return
    const faltando = alunos.filter((a) => !(notas[a.matricula] || '').trim()).length
    if (faltando > 0) setSemNota(faltando)
    else enviar()
  }

  function renderAluno({ item, index }) {
    const proximo = alunos[index + 1]
    return (
      <View style={base.linha}>
        <View style={styles.aluno}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={base.pequeno}>{item.matricula}</Text>
        </View>
        <View style={styles.campo}>
          <TextInput
            ref={(r) => { campos.current[item.matricula] = r }}
            style={[base.input, erros[item.matricula] && base.inputErro, enviado && base.inputBloqueado]}
            value={notas[item.matricula] || ''}
            editable={!enviado}
            keyboardType="decimal-pad"
            aria-label={'Nota de ' + item.nome}
            onChangeText={(texto) => setNotas({ ...notas, [item.matricula]: texto })}
            onBlur={() => validarCampo(item.matricula)}
            onSubmitEditing={() => proximo && campos.current[proximo.matricula]?.focus()}
          />
          {erros[item.matricula] && <Text style={base.msgErro}>A nota deve estar entre 0 e 10</Text>}
        </View>
      </View>
    )
  }

  return (
    <View style={base.tela}>
      <Aviso texto={aviso} onFechar={() => setAviso('')} />
      <Text style={base.titulo}>Lançar notas</Text>
      <Text>Banco de Dados – Turma A. Período: 2026.2</Text>

      <SeletorAvaliacao valor={avaliacao} onEscolher={escolherAvaliacao} lancamentos={lancamentos} />

      {avaliacao === '' && <Text style={base.info}>Escolha uma avaliação para lançar as notas.</Text>}

      {avaliacao !== '' && (
        <>
          <View style={base.linhaTitulo}>
            <Text style={base.subtitulo}>{avaliacao}</Text>
            <Etiqueta status={lancamento?.status} />
          </View>

          {lancamento?.status === 'Rascunho' && (
            <Text style={base.banner}>Este lançamento é um rascunho. Último salvamento: {lancamento.salvoEm}</Text>
          )}
          {enviado && (
            <Text style={base.banner}>Notas enviadas. Para alterar uma nota, use a tela Editar nota.</Text>
          )}

          <FlatList
            data={alunos}
            keyExtractor={(a) => a.matricula}
            renderItem={renderAluno}
            extraData={{ notas, erros, enviado }}
            keyboardShouldPersistTaps="handled"
          />

          <View style={base.rodape}>
            <Botao texto="Enviar notas" tipo="primario" onPress={clicarEnviar} desabilitado={enviado} />
            <Botao texto="Salvar rascunho" onPress={salvarRascunho} desabilitado={enviado} />
          </View>
        </>
      )}

      {semNota > 0 && (
        <Modal
          titulo="Alunos sem nota"
          textoConfirmar="Enviar mesmo assim"
          textoCancelar="Voltar e completar"
          onConfirmar={enviar}
          onCancelar={() => setSemNota(0)}
        >
          <Text>{semNota === 1 ? '1 aluno está sem nota.' : semNota + ' alunos estão sem nota.'}</Text>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  aluno: { flex: 1 },
  nome: { fontSize: 16 },
  campo: { width: 170 },
})
