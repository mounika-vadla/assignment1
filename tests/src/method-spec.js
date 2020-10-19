const chai = require('chai')
const expect = chai.expect
var methods = require("../../method.js");
describe('mangoTest', () => {
    describe('countDocumentsByQuery ', () => {

        /* beforeEach(() => {
           expect(methods.DB_URL) 
         });*/
        it('countDocumentsByQuery when collection name is Null ', () => {
            expect(() => methods.countDocuments(null, { $text: { $search: "test" } })).to.throw('The provided parameters were invalid. Collection name is Null');

        });
        it('countDocumentsByQuery when collection name not available', () => {
            let collectionName = "zebra";
            let searchKeyWord = "test";
            expect(() => methods.countDocuments(collectionName, { $text: { $search: searchKeyWord } })).to.Throw('The provided collection name is not available. Collection name : {collectionName} is not available');
        });
        it('countDocumentsByQuery when query  is Null or Empty ', () => {

            let collectionName = "collection1";
            let searchKeyWord = "";
            expect(() => methods.countDocuments(collectionName, { $text: { $search: searchKeyWord } })).to.Throw('The provided search query is empty.');
        });
        it('countDocumentsByQuery when query is Invald ', () => {

            let collectionName = "collection1";
            //invalid query
            let query = { text: { search: "abc" } };
            expect(() => methods.countDocuments(collectionName,query )).to.Throw('The provided search query is invalid');
        });
        it('countDocumentsByQuery when document count is zero', () => {
            let collectionName = "collection1";
            let query = { $text: { $search: "searchKeyWord" } };
            expect(methods.countDocuments(collectionName,query )).to.equal(0);

        });
        it('countDocumentsByQuery when document count is valid', () => {

            let collectionName = "collection1";
            let query = { $text: { $search: "a" } };
            expect(methods.countDocuments(collectionName,query )).to.be.above(1,"Many documents will be fetched which contains 'a' as part of the strings");
        });
    });
    describe('insertIntoDb', () => {
        
            let ArrayofDocuments =  [
                {
           
            title: "MongoDB 1",
            description: "MongoDB is no sql database",
             by: "Mouni", 
            tags: ['mongodb', 'database', 'NoSQL'],
            likes: 100
             },
             
                {
                title: "NoSQL Database",
                description: "NoSQL database doesn't have tables",
                by: "tutorials point",	
                tags: ["mongodb", "database", "NoSQL"],
                likes: 20,
                comments: [
                    {
                        user:"user1",
                        message: "My first comment",
                        dateCreated: new Date(2013,11,10,2,35),
                        like: 0
                    }
                ]
            }
            ];
         let collectionName  ="collection" ;
        it('insertIntoDb when collectionName is Null', () => {
            expect(() => methods.insertMany(null, ArrayofDocuments[0])).to.throw('Document is single. Collection name is Null');

        });
        it('insertIntoDb when document is null or empty', () => {

            expect(() => methods.insertMany(collectionName, null)).to.throw('Document is Null. Collection name is Valid');
        });
        it('insertIntoDb when collectionName is not available', () => {
            expect(() => methods.insertMany("zebra",ArrayofDocuments[1])).to.throw('Document is single. Collection name is not available');

        });
        it('insertIntoDb when document is invalid', () => {
            let invalidDocument=[{ title: "MongoDB 1",comments:{"$$$$":"2673"}];
            expect(() => methods.insertMany(collectionName,invalidDocument).to.throw('Document is Invalid. Collection name is Valid');

        });
        it('insertIntoDb when valid collectionName with single document', () => {
            let result= methods.insertMany(collectionName,ArrayofDocuments[0]);
            expect(result.acknowledged).to.be.true;
            expect(result.insertedIds.length).to.be.equal(1);
        });

        it('insertIntoDb when validcollectionName with Array of documents', () => {
            let result= methods.insertMany(collectionName,ArrayofDocuments);
            expect(result.acknowledged).to.be.true;
            expect(result.insertedIds.length).to.be.equal(2);
        });
    })
})