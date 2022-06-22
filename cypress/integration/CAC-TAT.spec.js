/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() { //Descrição sa swit e funcão de callback
    beforeEach(function(){
        cy.visit('./src/index.html')
    })


    it('Verifica o título da aplicação', function() { //descrição do teste e função de callback
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', function(){
        const longText='Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, '

        cy.get('#firstName').type('Allyson')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('allyson@hotmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0}) //para digitar um texto longo e deixar o teste rápido mesmo assim, sem o longText, até o texto ser inserido por completo, leva muito tempo.
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um e-mail com formatação inválida', function(){
        cy.get('#firstName').type('Allyson')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('allyson@hotmail.e')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Campo telefone continua vazio quando preenchido com valor não numérico', function(){
        cy.get('#phone').type('abcdefghij').should('have.value', '')

    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Allyson')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('allyson@hotmail.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Allyson').should('have.value', 'Allyson').clear().should('have.value','')
        cy.get('#lastName').type('Alves').should('have.value', 'Alves').clear().should('have.value','')
        cy.get('#email').type('allyson@hotmail.com').should('have.value', 'allyson@hotmail.com').clear().should('have.value','')
        cy.get('#phone').type('12345678').should('have.value','12345678').clear().should('have.value','')

    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Envia o formulário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    }) 

    //YouTube
    it('Seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    //Mentoria
    it('Seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    //Blog
    it('Selecione um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('Marca cada tipo de atendimento (Feedback)', function(){
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
    })

    it('Marca cada tipo de atentimento', function(){
        cy.get('input[type="radio"]').should('have.length', 3).each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('Marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]').check().should('be.checked').last().uncheck().should('not.be.checked')
    })

    it('Exibe mensagem de erro  quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Allyson')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('allyson@hotmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.clock()

        cy.get('.error').should('be.visible')

        cy.tick(3000)

        cy.get('.error').should('not.be.visible')
    })
//passamos o arquivo diretamente para selecionar
    it('Seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json').should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
//passamos o arquivo arrastando-o para o input
    it('Seleciona um arquivoo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}).should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]').selectFile('@sampleFile').should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('Acessa a página de política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a').invoke('removeAttr', 'target').click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it.only('Exibe e esconde as mensagens de sucesso e erro usando o .invoke', function (){
        cy.get('.success')
        cy.should('not.be.visible')
        cy.invoke('show')
        cy.should('be.visible')
        cy.and('contain', 'Mensagem enviada com sucesso.')
        cy.invoke('hide')
        cy.should('not.be.visible')

        cy.get('.error')
        cy.should('not.be.visible')
        cy.invoke('show')
        cy.should('be.visible')
        cy.and('contain', 'Valide os campos obrigatório!')
        cy.invoke('hide')
        cy.should('not.be.visible')

    })

  })