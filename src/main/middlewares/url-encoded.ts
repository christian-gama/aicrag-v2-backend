import express from 'express'

export const urlEncoded = express.urlencoded({ extended: true, limit: '80kb' })
