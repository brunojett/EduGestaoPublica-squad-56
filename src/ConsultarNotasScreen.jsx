import { useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { alunos, avaliacoes, calcularMedia } from './dados.js'
import { Botao, Etiqueta, SeletorAvaliacao, base } from '../../../src/componentes.jsx'

// Tela #203: consultar notas por turma (filtro e média)
export default function ConsultarNotasScreen({ lancamentos, irPara }) {
  const [filtro, setFiltro] = useState('') // vazio = todas as avaliações
  const colunas = filtro ? [filtro] : avaliacoes

  const cabecalho = (
    <View style={base.linha}>
      <Text style={[styles.nome, styles.negrito]}>Aluno</Text>
      {colunas.map((av) => (
        <View key={av} style={styles.celula}>
          <Text style={styles.negrito}>{av}</Text>
          <Etiqueta status={lancamentos[av]?.status} />
        </View>
      ))}
    </View>
  )

  // Média só com notas enviadas
  const rodape = (
    <View style={base.linha}>
      <Text style={[styles.nome, styles.negrito]}>Média da turma</Text>
      {colunas.map((av) => {
        const m = calcularMedia(lancamentos[av])
        return (
          <View key={av} style={styles.celula}>
            {m ? (
              <>
                <Text style={styles.media}>{m.valor}</Text>
                <Text style={base.pequeno}>Média calculada com {m.quantidade} de {alunos.length} alunos</Text>
              </>
            ) : (
              <Text>Média indisponível</Text>
            )}
          </View>
        )
      })}
    </View>
  )

  function renderAluno({ item }) {
    return (
      <View style={base.linha}>
        <View style={styles.nome}>
          <Text>{item.nome}</Text>
          <Text style={base.pequeno}>{item.matricula}</Text>
        </View>
        {colunas.map((av) => {
          const l = lancamentos[av]
          // Só nota enviada aparece como registrada
          const nota = l?.status === 'Enviado' ? l.notas[item.matricula] : undefined
          return (
            <View key={av} style={styles.celula}>
              <Text>{nota || '–'}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={base.tela}>
      <Text style={base.titulo}>Notas por turma</Text>
      <Text>Banco de Dados – Turma A. Período: 2026.2</Text>

      <SeletorAvaliacao comTodas valor={filtro} onEscolher={setFiltro} lancamentos={lancamentos} />
      <View style={base.rodape}>
        <Botao texto="Limpar filtros" onPress={() => setFiltro('')} />
        <Botao texto="Ir para lançamento" onPress={() => irPara('lancar')} />
        <Botao texto="Editar notas" onPress={() => irPara('editar')} />
      </View>

      {Object.keys(lancamentos).length === 0 && (
        <Text style={base.info}>Nenhuma nota lançada ainda. Use Ir para lançamento.</Text>
      )}

      <FlatList
        data={alunos}
        keyExtractor={(a) => a.matricula}
        renderItem={renderAluno}
        extraData={{ lancamentos, filtro }}
        ListHeaderComponent={cabecalho}
        ListFooterComponent={rodape}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  nome: { flex: 2 },
  celula: { flex: 1, paddingHorizontal: 4 },
  negrito: { fontWeight: 'bold' },
  media: { fontSize: 20, fontWeight: 'bold', color: '#0f6b7a' },
})
