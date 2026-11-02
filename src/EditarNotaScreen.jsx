import { useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import { alunos, paraNumero, formata, valida, calcularMedia } from './dados.js'
import { Botao, Etiqueta, Aviso, Modal, SeletorAvaliacao, base } from '../../../src/componentes.jsx'

// Tela #204: editar nota já enviada (com confirmação)
export default function EditarNotaScreen({ lancamentos, setLancamentos }) {
  const [avaliacao, setAvaliacao] = useState('')
  const [editando, setEditando] = useState(null) // matrícula do aluno em edição
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState(false)
  const [confirmar, setConfirmar] = useState(null) // { aluno, de, para }
  const [aviso, setAviso] = useState('')

  const lancamento = lancamentos[avaliacao]
  const enviado = lancamento?.status === 'Enviado'
  const media = calcularMedia(lancamento)

  function escolherAvaliacao(nome) {
    setAvaliacao(nome)
    setEditando(null)
    setErro(false)
    setAviso('')
  }

  function editar(aluno) {
    setEditando(aluno.matricula)
    setValor(lancamento.notas[aluno.matricula])
    setErro(false)
  }

  function salvarAlteracao(aluno) {
    const texto = valor.trim()
    if (texto === '' || !valida(texto)) {
      setErro(true)
      return
    }
    setErro(false)
    const de = lancamento.notas[aluno.matricula]
    const para = formata(paraNumero(texto))
    if (para === de) {
      setEditando(null) // mesmo valor: não pede confirmação e não grava
      return
    }
    setConfirmar({ aluno, de, para })
  }

  function confirmarAlteracao() {
    const { aluno, para } = confirmar
    setLancamentos({
      ...lancamentos,
      [avaliacao]: { ...lancamento, notas: { ...lancamento.notas, [aluno.matricula]: para } },
    })
    setConfirmar(null)
    setEditando(null)
    setAviso('Nota de ' + aluno.nome + ' atualizada com sucesso')
  }

  function renderAluno({ item }) {
    const nota = lancamento.notas[item.matricula]
    const emEdicao = editando === item.matricula
    return (
      <View style={styles.bloco}>
        <View style={styles.topo}>
          <View style={styles.aluno}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={base.pequeno}>{item.matricula}</Text>
          </View>
          <Text style={styles.nota}>{nota || '–'}</Text>
          {nota && !emEdicao && (
            <Botao texto="Editar" rotulo={'Editar nota de ' + item.nome} onPress={() => editar(item)} />
          )}
        </View>

        {emEdicao && (
          <View>
            <TextInput
              style={[base.input, erro && base.inputErro]}
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              autoFocus
              aria-label={'Nova nota de ' + item.nome}
            />
            {erro && <Text style={base.msgErro}>A nota deve estar entre 0 e 10</Text>}
            <View style={base.rodape}>
              <Botao texto="Salvar alteração" tipo="primario" onPress={() => salvarAlteracao(item)} />
              <Botao texto="Cancelar" onPress={() => setEditando(null)} />
            </View>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={base.tela}>
      <Aviso texto={aviso} onFechar={() => setAviso('')} />
      <Text style={base.titulo}>Editar nota</Text>
      <Text>Banco de Dados – Turma A. Período: 2026.2</Text>

      <SeletorAvaliacao valor={avaliacao} onEscolher={escolherAvaliacao} lancamentos={lancamentos} />

      {avaliacao === '' && <Text style={base.info}>Escolha uma avaliação enviada para editar as notas.</Text>}

      {avaliacao !== '' && !enviado && (
        <Text style={base.info}>Só é possível editar notas de avaliações enviadas.</Text>
      )}

      {enviado && (
        <>
          <View style={base.linhaTitulo}>
            <Text style={base.subtitulo}>{avaliacao}</Text>
            <Etiqueta status="Enviado" />
          </View>

          <FlatList
            data={alunos}
            keyExtractor={(a) => a.matricula}
            renderItem={renderAluno}
            extraData={{ editando, valor, erro, lancamentos }}
            keyboardShouldPersistTaps="handled"
          />

          <Text style={styles.media}>
            Média da turma: {media ? media.valor : 'Média indisponível'}
          </Text>
        </>
      )}

      {confirmar && (
        <Modal
          titulo="Confirmar alteração da nota"
          textoConfirmar="Confirmar alteração"
          textoCancelar="Cancelar"
          onConfirmar={confirmarAlteracao}
          onCancelar={() => setConfirmar(null)}
        >
          <Text>{confirmar.aluno.nome} (matrícula {confirmar.aluno.matricula})</Text>
          <Text>{avaliacao}: de {confirmar.de} para {confirmar.para}</Text>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  bloco: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
  topo: { flexDirection: 'row', alignItems: 'center' },
  aluno: { flex: 1 },
  nome: { fontSize: 16 },
  nota: { fontSize: 16, fontWeight: 'bold', marginRight: 12 },
  media: { paddingVertical: 12, fontSize: 18, fontWeight: 'bold', color: '#0f6b7a' },
})
