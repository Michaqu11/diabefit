import * as React from 'react';
// import { Accordion, AccordionSummary, AccordionDetails  }from './accordionsStyle'
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import './accordions.scss'

export default function CustomizedAccordions() {

    interface IDayElement {
      mealName: string,
      grams: number,
      kcal: number,
      prot: number,
      fats: number,
      carbs: number
    }
    
    interface IDay {
      summary?: IDayElement,
      elements?: IDayElement[]
    }

    interface IDays {
      id: number,
      name: string,
      empty: boolean,
      extension?: IDay
    }

    const days:IDays[] = [
      {
        id: 1,
        name: 'Breakfast',
        empty: true
      },
      {
        id: 2,
        name: 'Snack I',
        empty: true
      },
      {
        id: 3,
        name: 'Lunch',
        empty: true
      },
      {
        id: 4,
        name: 'Snack II',
        empty: true
      },
      {
        id: 5,
        name: 'Dinner',
        empty: true
      },
      {
        id: 6,
        name: 'Snack III',
        empty: true
      },
    ]

  interface IValues {
      kcal: number,
      prot: number,
      fats: number,
      carbs: number
    }

const summaryNutritionalValues = (elements: IDayElement[] | undefined) => {
  let  kcal = 0, prot = 0, fats = 0, carbs = 0;
  
  elements && elements.forEach((element: IDayElement) => {
    kcal += element.kcal;
    prot += element.prot;
    fats += element.fats;
    carbs += element.carbs;
  })

  return {
    "kcal":kcal,
    "prot":prot,
    "fats":fats,
    "carbs":carbs
  }
}

  const details = (extension: IDay | undefined) => {
    if(!extension) return <div></div>
    const value: IValues = summaryNutritionalValues(extension.elements)
    return <div>
           {extension.elements && extension.elements.map((el: IDayElement)=> (
            <Typography>
            {el.mealName} | {el.grams}
            </Typography>
           ))}
           <Divider />

            <Typography>
            {value.kcal} kcal | Prot. {value.prot} | Fats {value.fats}g | Crabs {value.carbs}g
            </Typography>
    
    </div>
  }


  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {
      days.map((element: IDays) => (

      <Accordion expanded={expanded === `panel${element.id}`} onChange={handleChange(`panel${element.id}`)} key={element.id} sx={{marginBottom: "5px", borderRadius: "10px"}}>
        <AccordionSummary
         expandIcon={element.empty ? <AddIcon />: <ExpandMoreIcon />}
         aria-controls={element.name + "-content"}
         id={element.name}
        >
          <Typography>{element.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
         
          {details(element.extension)}
        </AccordionDetails>
      </Accordion>

      ))}
    </div>
  );
}