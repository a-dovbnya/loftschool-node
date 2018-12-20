process.env.BD = "testing";

const mongoose = require("mongoose");
const User = require("../models/user");
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");
const secret = require("../config/config.json").secret;
//const issueToken = require('../helpers/issueToken');
chai.use(chaiHttp);
describe("/GET main page", () => {
  it("test status code of main page", done => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        //res.text.should.be.a("string");
        //res.text.length.should.be.eql(0);
        done();
      });
  });
});
/*describe("User", () => {
  describe("/Get cats", () => {
    it("Получить всех пользователей из БД", done => {
      chai
        .request(server)
        .get("/api/getUsers")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});*/
