SELECT c.ID, p.CNPJ_CPF, IF(p.tipo_pessoa = 'F', 1, 2), p.nome, pj.nome_fantasia, IF(c.tipo_operacao = 2, 1, 2), c.ativo
-- 			pj.nome_fantasia, pj.inscricao_estadual, pj.data_abertura, pj.ramo_atividade,
--             pf.data_nascimento, pf.rg, pf.emissor_RG, pf.data_emissao_RG, pf.estado_civil,
--             pf.profissao, pf.conjuge_JSON
FROM exact_db.empresa c
	INNER JOIN exact_db.pessoa p ON p.id = c.pessoa_ID
    LEFT JOIN exact_db.pessoa_fisica pf ON pf.pessoa_ID = p.ID
	LEFT JOIN exact_db.pessoa_juridica pj ON pj.pessoa_ID = p.ID
WHERE tipo_operacao != 0;
