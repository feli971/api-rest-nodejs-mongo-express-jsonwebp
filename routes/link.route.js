import { Router } from "express";
import { createLink, getLink, getLinks, removeLink } from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator, paramLinkValidator } from "../middlewares/validatormanager.js";
const router = Router();


// GET               /api/v1/Links         all links
//GET               /api/v1/Links/:id      single link
//POST              /api/v1/Links          create link
//PUT/PATCH         /api/v1/Links/:id      create link
//DELETE             /api/v1/Links/:id     remove link

router.get ("/", requireToken ,getLinks );
router.get ("/:id", requireToken ,getLink );
router.post ("/", requireToken, bodyLinkValidator, createLink );
router.delete ("/", requireToken ,paramLinkValidator,removeLink );

export default router;