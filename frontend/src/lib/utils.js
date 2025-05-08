import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes com clsx e twMerge para uso eficiente com Tailwind CSS
 * @param {...string} inputs - Classes a serem combinadas
 * @returns {string} - String de classes combinadas e otimizadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Mapeia valores de status para textos amigáveis
 * @param {string} status - Status a ser formatado
 * @returns {string} - Texto formatado do status
 */
export function formatStatus(status) {
  const statusMap = {
    submetido: "Aguardando avaliação",
    aguardando_correcao: "Aguardando correção",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
    revisao: "Revisão solicitada",
  };

  return statusMap[status] || status;
}

/**
 * Retorna as classes de cor apropriadas para cada status
 * @param {string} status - Status para obter as cores
 * @returns {string} - Classes Tailwind para o status
 */
export function getStatusColor(status) {
  const colorMap = {
    submetido: "bg-blue-100 text-blue-800",
    aguardando_correcao: "bg-yellow-100 text-yellow-800",
    aprovado: "bg-green-100 text-green-800",
    reprovado: "bg-red-100 text-red-800",
    revisao: "bg-purple-100 text-purple-800",
    publicado: "bg-emerald-100 text-emerald-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
}

/**
 * Limita o tamanho de um texto e adiciona "..." se necessário
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Gera um ID único simples
 * @returns {string} - ID único
 */
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
