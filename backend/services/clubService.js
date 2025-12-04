import ClubStats from '../models/clubStatsModel.js';

/**
 * Incrementa a contagem de novos membros para um clube no mês e ano atuais.
 * @param {string} clubId - O ID do clube.
 */
export const incrementNewMemberCount = async (clubId) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() é 0-11

    await ClubStats.findOneAndUpdate(
      { club: clubId, year, month },
      { $inc: { newMembersCount: 1 } },
      {
        upsert: true, // Cria o documento se ele não existir
        new: true,
      }
    );
  } catch (error) {
    // Em um app de produção, seria bom logar isso em um serviço de monitoramento
    console.error(`Erro ao incrementar contagem de membros para o clube ${clubId}:`, error);
    // A falha aqui não deve quebrar a requisição principal (entrar/aprovar no clube)
    // por isso não lançamos o erro para cima.
  }
};