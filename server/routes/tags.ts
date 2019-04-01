import * as express from 'express';
import { searchTags } from '../controllers/tags';
import { searchValidations } from '../validation/query';

const router = express.Router();

router.route('/search')
.get([...searchValidations, searchTags]);

export const tagsRouter = router;
