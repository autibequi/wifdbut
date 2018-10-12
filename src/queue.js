#!/usr/bin/env node
var open = require('amqplib').connect('amqp://localhost');
var defs = require('amqplib/lib/defs')
var Args = require('amqplib/lib/api_args')

const openChannel = open.then((conn) => conn.createChannel())

const ack = deliveryTag => openChannel.then((ch) => ch.sendImmediately(defs.BasicAck, Args.ack(deliveryTag)))
const nack = deliveryTag => openChannel.then((ch) => ch.sendImmediately(defs.BasicAck, Args.nack(deliveryTag)))
const getOne = q => openChannel.then((ch) => ch.get(q));
const sendTo = (q, data) => openChannel.then((ch) => ch.sendToQueue(q, Buffer.from(data)));

module.exports = {
    ack,
    nack,
    getOne,
    sendTo,

}