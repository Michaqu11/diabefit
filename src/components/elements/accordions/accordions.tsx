import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import './accordions.scss'
import AccordionDetail from './accordionDetail';

export default function CustomizedAccordions() {

    interface IDayElement {
      mealName: string,
      grams: number,
      kcal: number,
      prot: number,
      fats: number,
      carbs: number,
      image?: string
    }
    
    interface IDay {
      elements?: IDayElement[]
    }

    interface IDays {
      id: number,
      name: string,
      empty: boolean,
      extension?: IDay
    }



    const lunch:IDay ={
      elements: [
        {
          mealName: "Kebab",
          grams: 200,
          kcal: 510,
          prot: 28.4,
          fats: 32.4,
          carbs: 28.0,
          image:'https://staticsmaker.iplsc.com/smaker_production_2022_11_16/26bb30c30d60775239c5bc09c9735973-recipe_main.jpg'
        },
        {
          mealName: "Frytki",
          grams: 500,
          kcal: 220,
          prot: 0,
          fats: 0,
          carbs: 55.0
        }
      ]
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
        empty: false,
        extension:lunch
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
    return <div className='summary'>
      <Typography>
      {value.kcal} kcal P {value.prot} F {value.fats}g C {value.carbs}g
      </Typography>
    </div>
  }

  interface IElement {
    header: string,
    secondary: string,
    image: string,
  }

  const elements =  (elements: IDayElement[] | undefined): IElement[] | undefined => {
    if(!elements) return undefined

    return elements.map((el: IDayElement)  => {
      return {
      header: `${el.mealName} | ${el.kcal} kcal`,
      secondary: `Prot. ${el.prot} Fats ${el.fats}g Crabs ${el.carbs}g`,
      image: el.image ? el.image : ''
    }})

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
          {
           !element.empty ? <Typography sx={{ color: 'text.secondary' }}>{details(element.extension)}</Typography> : ''
          }
        </AccordionSummary>
        <AccordionDetails>
          <AccordionDetail elementsProps={elements(element.extension?.elements)} />
        </AccordionDetails>
      </Accordion>

      ))}
    </div>
  );
}